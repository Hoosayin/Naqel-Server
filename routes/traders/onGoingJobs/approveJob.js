const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const OnGoingJobs = require("../../../models/onGoingJobs");
const JobObjections = require("../../../models/jobObjections");
const CompletedJobs = require("../../../models/completedJobs");

var router = express.Router();
router.use(cors());

// POST: approveJob
router.post("/approveJob", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                OnGoingJobs.findOne({
                    where: { TraderID: result.Trader.TraderID }
                }).then(onGoingJob => {
                    if (onGoingJob) {
                        JobObjections.findOne({
                            where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                        }).then(jobObjection => {
                            if (jobObjection) {
                                response.json({
                                    Message: "On-going job has objections."
                                });
                            }
                            else {
                                if (onGoingJob.CompletedByDriver) {
                                    let newCompletedJob = {
                                        DriverID: onGoingJob.DriverID,
                                        TraderID: onGoingJob.TraderID,
                                        TripType: onGoingJob.TripType,
                                        CargoType: onGoingJob.CargoType,
                                        CargoWeight: onGoingJob.CargoWeight,
                                        LoadingPlace: onGoingJob.LoadingPlace,
                                        UnloadingPlace: onGoingJob.UnloadingPlace,
                                        LoadingDate: onGoingJob.LoadingDate,
                                        LoadingTime: onGoingJob.LoadingTime,
                                        EntryExit: onGoingJob.EntryExit,
                                        AcceptedDelay: onGoingJob.AcceptedDelay,
                                        Price: onGoingJob.Price,
                                        Created: new Date()
                                    };

                                    CompletedJobs.create(newCompletedJob).then(() => {
                                        onGoingJob.destroy();

                                        response.json({
                                            Message: "Job is approved."
                                        });
                                    });
                                }
                                else {
                                    response.json({
                                        Message: "Driver has not completed the job yet."
                                    });
                                }
                            }
                        });
                    }
                    else {
                        response.json({
                            Message: "On-going job not found."
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