const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
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

                        if (jobObjections) {
                            let jobObjectionPackages = [];
                            let count = 0;

                            for (let jobObjection of jobObjections) {
                                let firstName;
                                let lastName;

                                if (jobObjection.ObjectionBy === "Driver") {
                                    firstName = result.Driver.FirstName;
                                    lastName = result.Driver.LastName;
                                }
                                else if (jobObjection.ObjectionBy === "Trader") {
                                    const trader = await Traders.findOne({
                                        attributes: ["FirstName", "LastName"],
                                        where: { TraderID: jobObjection.TraderID }
                                    });

                                    firstName = trader.FirstName;
                                    lastName = trader.LastName;
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