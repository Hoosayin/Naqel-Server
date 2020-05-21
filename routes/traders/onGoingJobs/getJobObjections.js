const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");
const Traders = require("../../../models/traders");
const JobObjections = require("../../../models/jobObjections");
const OnGoingJobs = require("../../../models/onGoingJobs");

var router = express.Router();
router.use(cors());

// GET: getJobObjections
router.get("/getJobObjections", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, async result => {
        try {
            if (result.Message === "Trader found.") {
                OnGoingJobs.findOne({
                    where: { OnGoingJobID: request.query.OnGoingJobID }
                }).then(onGoingJob => {
                    if (onGoingJob) {
                        JobObjections.findAll({
                            where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                        }).then(async jobObjections => {
                            if (jobObjections) {
                                let modifiableJobObjections = [];
                                let count = 0;

                                for (let jobObjection of jobObjections) {
                                    if (jobObjection.ObjectionBy === "Driver") {
                                        const driver = await Drivers.findOne({
                                            attributes: ["FirstName", "LastName", "Username"],
                                            where: { DriverID: jobObjection.DriverID }
                                        });

                                        let objectionBy = {
                                            FirstName: driver.FirstName,
                                            LastName: driver.LastName,
                                            Username: driver.Username,
                                            Type: "Driver"
                                        };

                                        let modifiableJobObjection = jobObjection.dataValues;
                                        modifiableJobObjection.ObjectionBy = objectionBy;

                                        modifiableJobObjections[count++] = modifiableJobObjection;
                                    }
                                    else if (jobObjection.ObjectionBy === "Trader") {
                                        const trader = await Traders.findOne({
                                            attributes: ["FirstName", "LastName", "Username", "Type"],
                                            where: { TraderID: jobObjection.TraderID }
                                        });

                                        let objectionBy = {
                                            FirstName: trader.FirstName,
                                            LastName: trader.LastName,
                                            Username: trader.Username,
                                            Type: trader.Type
                                        };

                                        let modifiableJobObjection = jobObjection.dataValues;
                                        modifiableJobObjection.ObjectionBy = objectionBy;

                                        modifiableJobObjections[count++] = modifiableJobObjection;
                                    }
                                }

                                response.json({
                                    Message: "Job objections found.",
                                    JobObjections: modifiableJobObjections
                                });
                            }
                            else {
                                response.json({
                                    Message: "Job objections not found."
                                });
                            }
                        });
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