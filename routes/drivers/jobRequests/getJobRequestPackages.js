const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");
const JobRequests = require("../../../models/jobRequests");
const TraderRequests = require("../../../models/traderRequests");
const OnGoingJobs = require("../../../models/onGoingJobs");

var router = express.Router();
router.use(cors());

// GET: getJobRequestPackages
router.get("/getJobRequestPackages", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, async result => {
        try {
            if (result.Message === "Driver found.") {
                const onGoingJob = await OnGoingJobs.findOne({
                    where: { DriverID: result.Driver.DriverID }
                });

                const driverOnJob = onGoingJob ? true : false;

                const jobRequests = await JobRequests.findAll({
                    where: { DriverID: result.Driver.DriverID }
                });

                if (jobRequests && jobRequests.length > 0) {
                    let jobRequestPackages = [];
                    let count = 0;

                    for (let jobRequest of jobRequests) {

                        const traderRequests = await TraderRequests.findAll({
                            where: { JobRequestID: jobRequest.JobRequestID }
                        });

                        let traderRequestPackages = [];

                        if (traderRequests && traderRequests.length > 0) {                       
                            let count = 0;

                            for (let traderRequest of traderRequests) {
                                const trader = await Traders.findOne({
                                    where: { TraderID: traderRequest.TraderID }
                                });

                                const profilePhoto = await TraderProfilePhotos.findOne({
                                    where: { TraderID: trader.TraderID }
                                });

                                traderRequestPackages[count++] = {
                                    TraderRequest: traderRequest,
                                    Trader: trader,
                                    ProfilePhoto: profilePhoto ? profilePhoto.PhotoURL : null
                                };
                            }
                        }

                        if (traderRequestPackages.length > 0) {
                            traderRequestPackages.sort((a, b) => {
                                let dateA = new Date(a.TraderRequest.Created);
                                let dateB = new Date(b.TraderRequest.Created);
                                return dateB - dateA;
                            });
                        }

                        jobRequestPackages[count++] = {
                            JobRequest: jobRequest,
                            DriverOnJob: driverOnJob,
                            TraderRequestPackages: traderRequestPackages
                        };
                    }

                    response.json({
                        Message: "Job request packages found.",
                        JobRequestPackages: jobRequestPackages,
                    });
                }
                else {
                    response.json({
                        Message: "Job request packages not found."
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