const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");
const JobObjections = require("../../../models/jobObjections");
const OnGoingJobs = require("../../../models/onGoingJobs");

var router = express.Router();
router.use(cors());

// GET: getOnGoingJobPackages
router.get("/getJobObjectionPackages", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, async result => {
        try {
            if (result.Message === "Trader found.") {
                OnGoingJobs.findOne({
                    where: { OnGoingJobID: request.query.OnGoingJobID }
                }).then(async onGoingJob => {
                    if (onGoingJob) {
                        const jobObjections = await JobObjections.findAll({
                            where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                        });

                        if (jobObjections) {
                            let jobObjectionPackages = [];
                            let count = 0;

                            for (let jobObjection of jobObjections) {
                                let firstName;
                                let lastName;

                                if (jobObjection.ObjectionBy === "Driver") {
                                    const driver = await Drivers.findOne({
                                        attributes: ["FirstName", "LastName"],
                                        where: { DriverID: jobObjection.DriverID }
                                    });

                                    firstName = driver.FirstName;
                                    lastName = driver.LastName;
                                }
                                else if (jobObjection.ObjectionBy === "Trader") {
                                    firstName = result.Trader.FirstName;
                                    lastName = result.Trader.LastName;
                                }
                                else {
                                    firstName = "";
                                    lastName = "";
                                }

                                jobObjectionPackages[count++] = {
                                    JobObjection: jobObjection,
                                    FirstName: firstName,
                                    LastName: lastName
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