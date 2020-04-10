const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobOffers = require("../../../models/jobOffers");
const DriverRequests = require("../../../models/driverRequests");
const Drivers = require("../../../models/drivers");
const DriverProfilePhotos = require("../../../models/driverProfilePhotos");
const DrivingLicences = require("../../../models/drivingLicences");
const DriverEntryExitCards = require("../../../models/driverEntryExitCards");
const DriverIdentityCards = require("../../../models/driverIdentityCards");
const Trucks = require("../../../models/trucks");
const Trailers = require("../../../models/trailers");

var router = express.Router();
router.use(cors());

// GET: getJobOfferPackages
router.get("/getJobOfferPackages", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, async result => {
        try {
            if (result.Message === "Trader found.") {
                const jobOffers = await JobOffers.findAll({
                    where: { TraderID: result.Trader.TraderID }
                });

                if (jobOffers && jobOffers.length > 0) {
                    let jobOfferPackages = [];
                    let count = 0;

                    for (let jobOffer of jobOffers) {

                        const driverRequests = await DriverRequests.findAll({
                            where: { JobOfferID: jobOffer.JobOfferID }
                        });

                        let driverRequestPackages = [];

                        if (driverRequests && driverRequests.length > 0) {                       
                            let count = 0;

                            for (let driverRequest of driverRequests) {
                                const driver = await Drivers.findOne({
                                    where: { DriverID: driverRequest.DriverID }
                                });

                                const profilePhoto = await DriverProfilePhotos.findOne({
                                    where: { DriverID: driver.DriverID }
                                });

                                const drivingLicence = await DrivingLicences.findOne({
                                    where: { DriverID: driver.DriverID }
                                });

                                const entryExitCard = await DriverEntryExitCards.findOne({
                                    where: { DriverID: driver.DriverID }
                                });

                                const identityCard = await DriverIdentityCards.findOne({
                                    where: { DriverID: driver.DriverID }
                                });

                                const truck = await Trucks.findOne({
                                    where: { DriverID: driver.DriverID }
                                });

                                const trailers = await Trailers.findAll({
                                    where: { TruckID: truck.TruckID }
                                });

                                driverRequestPackages[count++] = {
                                    DriverRequest: driverRequest,
                                    Driver: driver,
                                    ProfilePhoto: profilePhoto ? profilePhoto.PhotoURL : null,
                                    DrivingLicence: drivingLicence,
                                    EntryExitCard: entryExitCard,
                                    identityCard: identityCard,
                                    Truck: truck,
                                    Trailers: trailers,
                                };
                            }
                        }

                        if (driverRequestPackages.length > 0) {
                            driverRequestPackages.sort((a, b) => {
                                let dateA = new Date(a.DriverRequest.Created);
                                let dateB = new Date(b.DriverRequest.Created);
                                return dateB - dateA;
                            });
                        }

                        jobOfferPackages[count++] = {
                            JobOffer: jobOffer,
                            DriverRequestPackages: driverRequestPackages
                        };
                    }

                    response.json({
                        Message: "Job offer packages found.",
                        JobOfferPackages: jobOfferPackages,
                    });
                }
                else {
                    response.json({
                        Message: "Job offer packages not found."
                    });
                }
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