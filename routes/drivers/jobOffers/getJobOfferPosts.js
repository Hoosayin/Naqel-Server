const express = require("express");
const cors = require("cors");
const geolib = require("geolib");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");

const Trucks = require("../../../models/trucks");
const DriverPermitLicences = require("../../../models/driverPermitLicences");
const Traders = require("../../../models/traders");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");
const JobOffers = require("../../../models/jobOffers");
const DriverRequests = require("../../../models/driverRequests");

var router = express.Router();
router.use(cors());

function GetTruckSizesArray(truckSizes) {
    let truckSizesIntegerArray = [];

    truckSizes = truckSizes.split(" ").join("");
    truckSizes = truckSizes.split("KG").join("");
    truckSizes = truckSizes.substring(1, truckSizes.length - 1);

    let truckSizesArray = truckSizes.split("|");
    let count = 0;

    for (let truckSize of truckSizesArray) {
        truckSizesIntegerArray[count++] = parseInt(truckSize);
    }

    return truckSizesIntegerArray;
}

function FilterJobsByDriverLocation(driverLocation, jobOffers) {
    let filteredJobOffers = [];
    let count = 0;

    if (driverLocation) {
        for (let jobOffer of jobOffers) {
            let distance = geolib.getDistance(driverLocation, {
                lat: jobOffer.LoadingLat,
                lng: jobOffer.LoadingLng
            });

            if (distance <= 100) {
                filteredJobOffers[count++] = jobOffer;
            }
        }
    } else {
        filteredJobOffers = jobOffers;
    }

    return filteredJobOffers;
}

function FilterJobsByNationality(nationality, jobOffers) {
    let filteredJobOffers = [];
    let count = 0;

    for (let jobOffer of jobOffers) {
        const nationalities = jobOffer.DriverNationalities;

        if (nationalities === "" ||
            nationalities === null ||
            nationalities.includes("Any Nationality") ||
            nationalities.includes(nationality)) {
            filteredJobOffers[count++] = jobOffer;
        }
    }

    return filteredJobOffers;
}

function FilterJobsByTruckType(truckType, jobOffers) {
    let filteredJobOffers = [];
    let count = 0;

    for (let jobOffer of jobOffers) {
        const truckTypes = jobOffer.TruckTypes;

        if (truckTypes === "" ||
            truckTypes === null ||
            truckTypes.includes("Any Truck Type") ||
            truckTypes.includes(truckType)) {
            filteredJobOffers[count++] = jobOffer;
        }
    }

    return filteredJobOffers;
}

//function FilterJobsByTruckSize(truckSize, jobOffers) {
//    let filteredJobOffers = [];
//    let count = 0;

//    for (let jobOffer of jobOffers) {
//        const truckSizes = jobOffer.TruckSizes;

//        if (truckSizes === "" ||
//            truckSizes === null ||
//            truckSizes.includes("Any Truck Size") ||
//            truckSizes.includes(` ${truckSize} `)) {
//            filteredJobOffers[count++] = jobOffer;
//        }
//    }

//    return filteredJobOffers;
//}

function FilterJobsByTruckSize(truckSize, jobOffers) {
    let filteredJobOffers = [];
    let count = 0;

    for (let jobOffer of jobOffers) {
        const truckSizes = jobOffer.TruckSizes;

        if (truckSizes === "" ||
            truckSizes === null ||
            truckSizes.includes("Any Truck Size") ||
            truckSizes.includes(` ${truckSize} `)) {
            filteredJobOffers[count++] = jobOffer;
        } else {
            const truckSizesArray = GetTruckSizesArray(truckSizes);

            for (let truckSizeItem of truckSizesArray) {
                if (truckSize >= truckSizeItem) {
                    filteredJobOffers[count++] = jobOffer;
                    break;
                }
            }
        }
    }

    return filteredJobOffers;
}

async function FilterJobsByPermitType(driverID, jobOffers) {
    const permits = await DriverPermitLicences.findAll({
        where: { DriverID: driverID }
    });

    let filteredJobOffers = [];
    let count = 0;

    for (let jobOffer of jobOffers) {
        if (jobOffer.PermitType === "None" || jobOffer.PermitType === null) {
            filteredJobOffers[count++] = jobOffer;
        } else if (permits) {
            for (let permit of permits) {
                let distance = geolib.getDistance({
                    lat: permit.Lat,
                    lng: permit.Lng
                }, {
                    lat: jobOffer.UnloadingLat,
                    lng: jobOffer.UnloadingLng
                });

                if (distance <= 10000) {
                    if (permit.Type === jobOffer.PermitType) {
                        filteredJobOffers[count++] = jobOffer;
                        break;
                    }
                }
            }
        }
    }

    return filteredJobOffers;
}

// GET: getJobOfferPosts
router.get("/getJobOfferPosts", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, async result => {
        try {
            if (result.Message === "Driver found.") {
                const driver = result.Driver;

                const truck = await Trucks.findOne({
                    where: { DriverID: driver.DriverID }
                });

                if (!truck) {
                    response.json({
                        Message: "Truck not found."
                    });

                    return;
                }


                let jobOffers = await JobOffers.findAll();

                if (!jobOffers) {
                    response.json({
                        Message: "Job offer posts not found."
                    });

                    return;
                }

                let driverLocation = (request.query.DriverLat === null) ?
                    {
                        lat: request.query.DriverLat,
                        lng: request.query.DriverLng
                    } : null;

                jobOffers = FilterJobsByDriverLocation(driverLocation, jobOffers);
                jobOffers = FilterJobsByNationality(driver.Nationality, jobOffers);
                jobOffers = FilterJobsByTruckType(truck.Type, jobOffers);
                jobOffers = FilterJobsByTruckSize(truck.Capacity, jobOffers);
                jobOffers = await FilterJobsByPermitType(driver.DriverID, jobOffers);

                let jobOfferPosts = [];
                let count = 0;

                for (let jobOffer of jobOffers) {
                    const createdHoursAgo = Math.abs(new Date() - new Date(jobOffer.TimeCreated)) / 36e5;

                    if (createdHoursAgo < jobOffer.WaitingTime) {
                        const trader = await Traders.findOne({
                            attributes: ["FirstName", "LastName"],
                            where: { TraderID: jobOffer.TraderID }
                        });

                        const traderProfilePhoto = await TraderProfilePhotos.findOne({
                            attributes: ["PhotoURL"],
                            where: { TraderID: jobOffer.TraderID }
                        });

                        let modifiableTrader = trader.dataValues;
                        modifiableTrader.PhotoURL = traderProfilePhoto ? traderProfilePhoto.PhotoURL : null;

                        const driverRequest = await DriverRequests.findOne({
                            where: {
                                [Op.and]: [
                                    { JobOfferID: jobOffer.JobOfferID },
                                    { DriverID: result.Driver.DriverID }
                                ]
                            }
                        });

                        jobOfferPosts[count++] = {
                            JobOffer: jobOffer,
                            Trader: modifiableTrader,
                            DriverRequest: driverRequest
                        };
                    }
                }

                jobOfferPosts.sort((a, b) => {
                    let dateA = new Date(a.JobOffer.TimeCreated);
                    let dateB = new Date(b.JobOffer.TimeCreated);
                    return dateB - dateA;
                });

                response.json({
                    Message: "Job offer posts found.",
                    JobOfferPosts: jobOfferPosts
                });
            }
            else {
                response.json({
                    Message: result.Message
                });
            }
        } catch (error) {
            response.json({
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;