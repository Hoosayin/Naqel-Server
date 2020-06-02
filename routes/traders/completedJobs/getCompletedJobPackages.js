const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const CompletedJobs = require("../../../models/completedJobs");
const DriverReviews = require("../../../models/driverReviews");
const TraderBills = require("../../../models/traderBills");

var router = express.Router();
router.use(cors());

// GET: getCompletedJobs
router.get("/getCompletedJobPackages", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                CompletedJobs.findAll({
                    where: { TraderID: result.Trader.TraderID }
                }).then(async completedJobs => {
                    if (completedJobs) {
                        let completedJobPackages = [];
                        let count = 0;

                        for (let completedJob of completedJobs) {
                            const traderBill = await TraderBills.findOne({
                                where: { CompletedJobID: completedJob.CompletedJobID }
                            });

                            const driverReview = await DriverReviews.findOne({
                                where: { CompletedJobID: completedJob.CompletedJobID }
                            });

                            completedJob = completedJob.dataValues;
                            completedJob.Created = new Date(completedJob.Created);

                            completedJobPackages[count++] = {
                                CompletedJob: completedJob,
                                BillPaid: traderBill.Paid,
                                DriverReview: driverReview
                            };
                        }

                        if (completedJobPackages.length > 0) {
                            completedJobPackages.sort((a, b) => {
                                let dateA = new Date(a.CompletedJob.Created);
                                let dateB = new Date(b.CompletedJob.Created);
                                return dateB - dateA;
                            });
                        }

                        response.json({
                            Message: "Completed job packages found.",
                            CompletedJobPackages: completedJobPackages
                        });
                    }
                    else {
                        response.json({
                            Message: "Completed jobs not found."
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