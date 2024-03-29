const express = require("express");
const cors = require("cors");
const uuid = require("uuid-v4");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const OnGoingJobs = require("../../../models/onGoingJobs");
const DriverRequests = require("../../../models/driverRequests");
const JobOffers = require("../../../models/jobOffers");

var router = express.Router();
router.use(cors());

// POST: addOnGoingJobFromJobOffer
router.post("/addOnGoingJobFromJobOffer", (request, response) => {
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
                        DriverRequests.findOne({
                            where: { DriverRequestID: request.body.DriverRequestID }
                        }).then(driverRequest => {
                            if (driverRequest) {
                                OnGoingJobs.findOne({
                                    where: { DriverID: driverRequest.DriverID }
                                }).then(onGoingJob => {
                                    if (onGoingJob) {
                                        response.json({
                                            Message: "Driver is on job."
                                        });
                                    }
                                    else {
                                        JobOffers.findOne({
                                            where: {
                                                [Op.and]: [
                                                    { JobOfferID: driverRequest.JobOfferID },
                                                    { TraderID: result.Trader.TraderID }
                                                ]
                                            }
                                        }).then(jobOffer => {
                                            if (jobOffer) {
                                                const newOnGoingJob = {
                                                    DriverID: driverRequest.DriverID,
                                                    TraderID: result.Trader.TraderID,
                                                    JobNumber: uuid().substring(0, 8).toUpperCase(),
                                                    TripType: jobOffer.TripType,
                                                    CargoType: jobOffer.CargoType,
                                                    CargoWeight: jobOffer.CargoWeight,
                                                    LoadingPlace: jobOffer.LoadingPlace,
                                                    LoadingLat: jobOffer.LoadingLat,
                                                    LoadingLng: jobOffer.LoadingLng,
                                                    UnloadingPlace: jobOffer.UnloadingPlace,
                                                    UnloadingLat: jobOffer.UnloadingLat,
                                                    UnloadingLng: jobOffer.UnloadingLng,
                                                    LoadingDate: jobOffer.LoadingDate,
                                                    LoadingTime: jobOffer.LoadingTime,
                                                    TruckModel: null,
                                                    DriverNationality: null,
                                                    AcceptedDelay: jobOffer.AcceptedDelay,
                                                    Price: driverRequest.Price ? driverRequest.Price : jobOffer.Price,
                                                    CompletedByDriver: false,
                                                    CompletedByTrader: false,
                                                    DriverRated: false,
                                                    Created: new Date()
                                                };

                                                OnGoingJobs.create(newOnGoingJob).then(() => {
                                                    DriverRequests.destroy({
                                                        where: { JobOfferID: jobOffer.JobOfferID }
                                                    }).then(() => {
                                                        jobOffer.destroy();

                                                        response.json({
                                                            Message: "On-going job is added."
                                                        });
                                                    });
                                                });
                                            }
                                            else {
                                                response.json({
                                                    Message: "Job offer not found."
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                response.json({
                                    Message: "Driver request not found."
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