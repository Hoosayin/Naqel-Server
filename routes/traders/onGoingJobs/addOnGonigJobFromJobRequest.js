const express = require("express");
const cors = require("cors");
const uuid = require("uuid-v4");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const OnGoingJobs = require("../../../models/onGoingJobs");
const TraderRequests = require("../../../models/traderRequests");
const JobRequests = require("../../../models/jobRequests");

var router = express.Router();
router.use(cors());

// POST: addOnGoingJobFromJobRequest
router.post("/addOnGoingJobFromJobRequest", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                OnGoingJobs.findOne({
                    where: { TraderID: result.Trader.TraderID }
                }).then(onGoingJob => {
                    if (onGoingJob) {
                        response.json({
                            Message: "Trader is on job."
                        });
                    }
                    else {
                        TraderRequests.findOne({
                            where: { TraderRequestID: request.body.TraderRequestID }
                        }).then(traderRequest => {
                            if (traderRequest) {
                                JobRequests.findOne({
                                    where: { JobRequestID: traderRequest.JobRequestID }
                                }).then(jobRequest => {
                                    if (jobRequest) {
                                        OnGoingJobs.findOne({
                                            where: { DriverID: jobRequest.DriverID }
                                        }).then(onGoingJob => {
                                            if (onGoingJob) {
                                                response.json({
                                                    Message: "Driver is on job."
                                                });
                                            }
                                            else {
                                                const newOnGoingJob = {
                                                    DriverID: jobRequest.DriverID,
                                                    TraderID: result.Trader.TraderID,
                                                    JobNumber: uuid().substring(0, 8).toUpperCase(),
                                                    TripType: jobRequest.TripType,
                                                    CargoType: traderRequest.CargoType,
                                                    CargoWeight: traderRequest.CargoWeight,
                                                    LoadingPlace: jobRequest.LoadingPlace,
                                                    UnloadingPlace: jobRequest.UnloadingPlace,
                                                    LoadingLocation: null,
                                                    UnloadingLocation: null,
                                                    LoadingDate: traderRequest.LoadingDate,
                                                    LoadingTime: traderRequest.LoadingTime,
                                                    TruckModel: null,
                                                    DriverNationality: null,
                                                    EntryExit: traderRequest.EntryExit,
                                                    AcceptedDelay: traderRequest.AcceptedDelay,
                                                    Price: jobRequest.Price,
                                                    CompletedByDriver: false,
                                                    CompletedByTrader: false,
                                                    DriverRated: false,
                                                    Created: new Date()
                                                };

                                                OnGoingJobs.create(newOnGoingJob).then(() => {
                                                    TraderRequests.destroy({
                                                        where: { JobRequestID: jobRequest.JobRequestID }
                                                    }).then(() => {
                                                        jobRequest.destroy();

                                                        response.json({
                                                            Message: "On-going job is added."
                                                        });
                                                    });
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        response.json({
                                            Message: "Job request not found."
                                        });
                                    }
                                });
                            }
                            else {
                                response.json({
                                    Message: "Trader request not found."
                                });
                            }
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