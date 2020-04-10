const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");
const DriverProfilePhotos = require("../../../models/driverProfilePhotos");
const DriverEntryExitCards = require("../../../models/driverEntryExitCards");
const DriverIdentityCards = require("../../../models/driverIdentityCards");
const DrivingLicences = require("../../../models/drivingLicences");
const Trucks = require("../../../models/trucks");
const Trailers = require("../../../models/trailers");
const JobRequests = require("../../../models/jobRequests");
const TraderRequests = require("../../../models/traderRequests");

var router = express.Router();
router.use(cors());

// GET: getJobRequestPosts
router.get("/getJobRequestPosts", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, async result => {
        try {
            if (result.Message === "Trader found.") {
                const drivers = await Drivers.findAll();

                if (drivers) {
                    let jobRequestPosts = [];
                    let count = 0;

                    for (let driver of drivers) {
                        const jobRequests = await JobRequests.findAll({
                            where: { DriverID: driver.DriverID }
                        });

                        if (jobRequests && jobRequests.length > 0) {
                            const truck = await Trucks.findOne({
                                where: { DriverID: driver.DriverID }
                            });

                            if (truck) {
                                const trailers = await Trailers.findAll({
                                    where: { TruckID: truck.TruckID }
                                });

                                const driverProfilePhoto = await DriverProfilePhotos.findOne({
                                    where: { DriverID: driver.DriverID }
                                });

                                const identityCard = await DriverIdentityCards.findOne({
                                    where: { DriverID: driver.DriverID }
                                });

                                const entryExitCard = await DriverEntryExitCards.findOne({
                                    where: { DriverID: driver.DriverID }
                                });

                                const drivingLicence = await DrivingLicences.findOne({
                                    where: { DriverID: driver.DriverID }
                                });

                                for (let jobRequest of jobRequests) {
                                    const traderRequest = await TraderRequests.findOne({
                                        where: {
                                            [Op.and]: [
                                                { JobRequestID: jobRequest.JobRequestID },
                                                { TraderID: result.Trader.TraderID }
                                            ]
                                        }
                                    });

                                    jobRequestPosts[count++] = {
                                        JobRequest: jobRequest,
                                        Driver: driver,
                                        DriverProfilePhoto: driverProfilePhoto ? driverProfilePhoto.PhotoURL : null,
                                        IdentityCard: identityCard,
                                        EntryExitCard: entryExitCard,
                                        DrivingLicence: drivingLicence,
                                        Truck: truck,
                                        Trailers: trailers,
                                        RequestSent: traderRequest ? true : false
                                    };
                                }
                            }
                        }
                    }

                    if (jobRequestPosts.length > 0) {
                        jobRequestPosts.sort((a, b) => {
                            let dateA = new Date(a.JobRequest.TimeCreated);
                            let dateB = new Date(b.JobRequest.TimeCreated);
                            return dateB - dateA;
                        });

                        response.json({
                            Message: "Job request posts found.",
                            JobRequestPosts: jobRequestPosts
                        });
                    }
                    else {
                        response.json({
                            Message: "Job request posts not found."
                        });
                    }
                }
                else {
                    response.json({
                        Message: "Drivers not found."
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