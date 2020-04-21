const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const JobRequests = require("../../../models/jobRequests");
const TraderRequests = require("../../../models/traderRequests");
const OnGoingJobs = require("../../../models/onGoingJobs");

var router = express.Router();
router.use(cors());

// POST: addOnGoingJob
router.post("/addOnGoingJob", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                OnGoingJobs.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(onGoingJob => {
                    if (onGoingJob) {
                        response.json({
                            Message: "On-Going job already found."
                        });
                    }
                    else {
                        TraderRequests.findOne({
                            where: { TraderRequestID: request.body.TraderRequestID }
                        }).then(traderRequest => {
                            if (traderRequest) {
                                JobRequests.findOne({
                                    where: {
                                        [Op.and]: [
                                            { JobRequestID: traderRequest.JobRequestID },
                                            { DriverID: result.Driver.DriverID }
                                        ]
                                    }
                                }).then(jobRequest => {
                                    if (jobRequest) {
                                        const newOnGoingJob = {
                                            DriverID: result.Driver.DriverID,
                                            TraderID: traderRequest.TraderID,
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