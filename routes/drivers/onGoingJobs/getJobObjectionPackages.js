const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");
const DriverProfilePhotos = require("../../../models/DriverProfilePhotos");
const JobObjections = require("../../../models/jobObjections");
const OnGoingJobs = require("../../../models/onGoingJobs");


var router = express.Router();
router.use(cors());

// GET: getOnGoingJobPackages
router.get("/getJobObjectionPackages", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, async result => {
        try {
            if (result.Message === "Driver found.") {
                OnGoingJobs.findOne({
                    where: { OnGoingJobID: request.query.OnGoingJobID }
                }).then(async onGoingJob => {
                    if (onGoingJob) {
                        const jobObjections = await JobObjections.findAll({
                            where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                        });

                        if (jobObjections && jobObjections.length > 0) {
                            let jobObjectionPackages = [];
                            let count = 0;

                            for (let jobObjection of jobObjections) {
                                let firstName;
                                let lastName;
                                let profilePhoto;

                                if (jobObjection.ObjectionBy === "Driver") {
                                    firstName = result.Driver.FirstName;
                                    lastName = result.Driver.LastName;
                                    const driverProfilePhoto = await DriverProfilePhotos.findOne({
                                        where: { DriverID: result.Driver.DriverID }
                                    });

                                    profilePhoto = driverProfilePhoto ? driverProfilePhoto.PhotoURL : null;
                                }
                                else if (jobObjection.ObjectionBy === "Trader") {
                                    const trader = await Traders.findOne({
                                        attributes: ["FirstName", "LastName"],
                                        where: { TraderID: jobObjection.TraderID }
                                    });

                                    const traderProfilePhoto = await TraderProfilePhotos.findOne({
                                        where: { TraderID: trader.TraderID }
                                    });

                                    profilePhoto = traderProfilePhoto ? traderProfilePhoto.PhotoURL : null;
                                }
                                else {
                                    firstName = "";
                                    lastName = "";
                                    profilePhoto = "";
                                }

                                jobObjectionPackages[count++] = {
                                    JobObjection: jobObjection,
                                    FirstName: firstName,
                                    LastName: lastName,
                                    ProfilePhoto: profilePhoto
                                };
                            }

                            response.json({
                                Message: "Job objection packages found.",
                                JobObjectionPackages: jobObjectionPackages
                            });
                        }
                        else {
                            response.json({
                                Message: "Job objection packages not found."
                            });
                        }
                    }
                    else {
                        response.json({
                            Message: "On-Going job not found."
                        });
                    }
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