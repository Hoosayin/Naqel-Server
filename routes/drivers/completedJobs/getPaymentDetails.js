const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const CompletedJobs = require("../../../models/completedJobs");
const TraderBills = require("../../../models/traderBills");
const TraderPayProofs = require("../../../models/traderPayProofs");
const TraderPayDetails = require("../../../models/traderPayDetails");

var router = express.Router();
router.use(cors());

// GET: getTraderPaymentDetails
router.get("/getTraderPaymentDetails", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                CompletedJobs.findOne({
                    where: { CompletedJobID: request.query.CompletedJobID }
                }).then(completedJob => {
                    if (completedJob) {
                        TraderBills.findOne({
                            where: { CompletedJobID: completedJob.CompletedJobID }
                        }).then(traderBill => {
                            if (traderBill) {
                                TraderPayProofs.findOne({
                                    where: { TraderBillID: traderBill.TraderBillID }
                                }).then(traderPayProof => {
                                    if (traderPayProof) {
                                        let traderPaymentDetails = {
                                            IsOnlinePayment: false,
                                            PayProof: traderPayProof
                                        };

                                        response.json({
                                            Message: "Trader payment details found.",
                                            TraderPaymentDetails: traderPaymentDetails
                                        });
                                    }
                                    else {
                                        TraderPayDetails.findOne({
                                            where: { TraderBillID: traderBill.TraderBillID }
                                        }).then(traderPayDetail => {
                                            if (traderPayDetail) {
                                                let traderPaymentDetails = {
                                                    IsOnlinePayment: true,
                                                    PayDetails: traderPayDetail
                                                };

                                                response.json({
                                                    Message: "Trader payment details found.",
                                                    TraderPaymentDetails: traderPaymentDetails
                                                });
                                            }
                                            else {
                                                response.json({
                                                    Message: "Payment details not found."
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                response.json({
                                    Message: "Trader bill not found."
                                });
                            }
                        });
                    }
                    else {
                        response.json({
                            Message: "Completed job not found."
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