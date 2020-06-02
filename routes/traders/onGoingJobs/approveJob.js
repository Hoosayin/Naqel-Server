const express = require("express");
const cors = require("cors");
const uuid = require("uuid-v4");
const passport = require("../../../helpers/passportHelper");
const OnGoingJobs = require("../../../models/onGoingJobs");
const JobObjections = require("../../../models/jobObjections");
const Trucks = require("../../../models/trucks");
const CompletedJobs = require("../../../models/completedJobs");
const TraderBills = require("../../../models/traderBills");
const TraderRates = require("../../../models/traderRates");
const PriceRanges = require("../../../models/priceRanges");
const TemporaryFeeRateHelper = require("../../../helpers/temporaryFeeRateHelper");
const GlobalFeeRateHelper = require("../../../helpers/globalFeeRateHelper");

var router = express.Router();
router.use(cors());

// POST: approveJob
router.post("/approveJob", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                let trader = result.Trader;

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
                                    Trucks.findOne({
                                        attributes: ["TruckID"],
                                        where: { DriverID: onGoingJob.DriverID }
                                    }).then(truck => {
                                        let newCompletedJob = {
                                            DriverID: onGoingJob.DriverID,
                                            TraderID: onGoingJob.TraderID,
                                            TruckID: truck ? truck.TruckID : null,
                                            JobNumber: onGoingJob.JobNumber,
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

                                        CompletedJobs.create(newCompletedJob).then(completedJob => {
                                            onGoingJob.destroy();

                                            let feeRate = 0;

                                            TemporaryFeeRateHelper.GetTemporaryFeeRateData(async result => {
                                                if (result.Message === "Temporary fee rate data found.") {
                                                    feeRate = result.TemporaryFeeRateData.FeeRate;

                                                    let newTraderBill = {
                                                        DriverID: completedJob.DriverID,
                                                        TraderID: completedJob.TraderID,
                                                        CompletedJobID: completedJob.CompletedJobID,
                                                        Amount: completedJob.Price,
                                                        Paid: false,
                                                        BillNumber: uuid().substring(0, 8).toUpperCase(),
                                                        FeeRate: feeRate,
                                                        Created: new Date()
                                                    };

                                                    TraderBills.create(newTraderBill).then(() => {
                                                        response.json({
                                                            Message: "Job is approved."
                                                        });
                                                    });
                                                }
                                                else {
                                                    const traderRate = await TraderRates.findOne({
                                                        where: { TraderID: trader.TraderID }
                                                    });

                                                    if (traderRate) {
                                                        feeRate = traderRate.FeeRate;

                                                        let newTraderBill = {
                                                            DriverID: completedJob.DriverID,
                                                            TraderID: completedJob.TraderID,
                                                            CompletedJobID: completedJob.CompletedJobID,
                                                            Amount: completedJob.Price,
                                                            Paid: false,
                                                            BillNumber: uuid().substring(0, 8).toUpperCase(),
                                                            FeeRate: feeRate,
                                                            Created: new Date()
                                                        };

                                                        TraderBills.create(newTraderBill).then(() => {
                                                            response.json({
                                                                Message: "Job is approved."
                                                            });
                                                        });
                                                    }
                                                    else {
                                                        const priceRanges = await PriceRanges.findAll();

                                                        if (priceRanges) {
                                                            const price = completedJob.Price;
                                                            let priceRangeFound = false;

                                                            for (let priceRange of priceRanges) {
                                                                if (price >= priceRange.StartRange &&
                                                                    price <= priceRange.EndRange) {
                                                                    priceRangeFound = true;
                                                                    feeRate = priceRange.FeeRate;

                                                                    let newTraderBill = {
                                                                        DriverID: completedJob.DriverID,
                                                                        TraderID: completedJob.TraderID,
                                                                        CompletedJobID: completedJob.CompletedJobID,
                                                                        Amount: completedJob.Price,
                                                                        Paid: false,
                                                                        BillNumber: uuid().substring(0, 8).toUpperCase(),
                                                                        FeeRate: feeRate,
                                                                        Created: new Date()
                                                                    };

                                                                    TraderBills.create(newTraderBill).then(() => {
                                                                        response.json({
                                                                            Message: "Job is approved."
                                                                        });
                                                                    });

                                                                    break;
                                                                }
                                                            }

                                                            if (!priceRangeFound) {
                                                                GlobalFeeRateHelper.GetGlobalFeeRate(result => {
                                                                    if (result.Message === "Global fee rate found.") {
                                                                        feeRate = result.FeeRate;

                                                                        let newTraderBill = {
                                                                            DriverID: completedJob.DriverID,
                                                                            TraderID: completedJob.TraderID,
                                                                            CompletedJobID: completedJob.CompletedJobID,
                                                                            Amount: completedJob.Price,
                                                                            Paid: false,
                                                                            BillNumber: uuid().substring(0, 8).toUpperCase(),
                                                                            FeeRate: feeRate,
                                                                            Created: new Date()
                                                                        };

                                                                        TraderBills.create(newTraderBill).then(() => {
                                                                            response.json({
                                                                                Message: "Job is approved."
                                                                            });
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        }
                                                        else {
                                                            GlobalFeeRateHelper.GetGlobalFeeRate(result => {
                                                                if (result.Message === "Global fee rate found.") {
                                                                    feeRate = result.FeeRate;

                                                                    let newTraderBill = {
                                                                        DriverID: completedJob.DriverID,
                                                                        TraderID: completedJob.TraderID,
                                                                        CompletedJobID: completedJob.CompletedJobID,
                                                                        Amount: completedJob.Price,
                                                                        Paid: false,
                                                                        BillNumber: uuid().substring(0, 8).toUpperCase(),
                                                                        FeeRate: feeRate,
                                                                        Created: new Date()
                                                                    };

                                                                    TraderBills.create(newTraderBill).then(() => {
                                                                        response.json({
                                                                            Message: "Job is approved."
                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            });
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