const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
const TraderRefundRates = require("../../../models/traderRefundRates");

var router = express.Router();
router.use(cors());

// POST: setRefundRate
router.post("/setRefundRate", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                Traders.findOne({
                    where: { TraderID: request.body.TraderID }
                }).then(trader => {
                    if (trader) {
                        TraderRefundRates.findOne({
                            where: { TraderID: trader.TraderID }
                        }).then(traderRefundRate => {
                            if (traderRefundRate) {
                                let updatedTraderRefundRate = {
                                    AdministratorID: result.Administrator.AdministratorID,
                                    RefundRate: request.body.RefundRate
                                };

                                TraderRefundRates.update(updatedTraderRefundRate, { where: { TraderRefundRateID: traderRefundRate.TraderRefundRateID } }).then(() => {
                                    TraderRefundRates.findOne({
                                        where: { TraderID: trader.TraderID }
                                    }).then(traderRefundRate => {
                                        if (traderRefundRate) {
                                            response.json({
                                                Message: "Refund rate is set.",
                                                RefundRate: traderRefundRate
                                            });
                                        }
                                        else {
                                            response.json({
                                                Message: "Refund rate not found."
                                            });
                                        }
                                    })
                                });
                            }
                            else {
                                let newTraderRefundRate = {
                                    TraderID: request.body.TraderID,
                                    AdministratorID: result.Administrator.AdministratorID,
                                    RefundRate: request.body.RefundRate
                                };

                                TraderRefundRates.create(newTraderRefundRate).then(traderRefundRate => {
                                    response.json({
                                        Message: "Refund rate is set.",
                                        RefundRate: traderRefundRate
                                    });
                                });
                            }
                        });
                    }
                    else {
                        response.json({
                            Message: " Trader not found."
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
                Message: error.message,
            });
        }
    })(request, response);
});

module.exports = router;