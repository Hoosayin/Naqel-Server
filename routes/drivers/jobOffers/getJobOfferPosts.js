const express = require("express");
const cors = require("cors");
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

function GetArray(itemString) {
    itemString = itemString.split(" ").join("");
    itemString = itemString.substring(1, itemString.length - 1);

    return itemString.split("|");
}

function FilterJobsByNationality(nationality, jobOffers) {
    let filteredJobOffers = [];
    let count = 0;

    for (let jobOffer of jobOffers) {
        const nationalities = jobOffer.DriverNationalities;

        if (nationalities === "" ||
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
            truckTypes.includes("Any Truck Type") ||
            truckTypes.includes(truckType)) {
            filteredJobOffers[count++] = jobOffer;
        }
    }

    return filteredJobOffers;
}

function FilterJobsByTruckSize(truckSize, jobOffers) {
    let filteredJobOffers = [];
    let count = 0;

    for (let jobOffer of jobOffers) {
        const truckSizes = jobOffer.TruckSizes;

        if (truckSizes === "" ||
            truckSizes.includes("Any Truck Size") ||
            truckSizes.includes(` ${truckSize} `)) {
            filteredJobOffers[count++] = jobOffer;
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


                const jobOffers = await JobOffers.findAll();

                if (!jobOffers) {
                    response.json({
                        Message: "Job offer posts not found."
                    });

                    return;
                }

                // Filter jobs by radius.
                // Filter jobs by Truck Types.
                // Filter jobs by Truck Sizes.
                // Filter jobs by Permit Types.



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