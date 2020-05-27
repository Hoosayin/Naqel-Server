const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
const TraderBills = require("../../../models/traderBills");
const TraderPayProofs = require("../../../models/traderPayProofs");
const TraderPayDetails = require("../../../models/traderPayDetails");

var router = express.Router();
router.use(cors());

// GET: getTraderAccountStatement
router.get("/getTraderAccountStatement", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                Traders.findOne({
                    attributes: ["TraderID", "Username", "FirstName", "LastName", "Type", "Address"],
                    where: { Username: request.query.Username }
                }).then(trader => {
                    if (trader) {
                        TraderBills.findAll({
                            where: { TraderID: trader.TraderID }
                        }).then(async traderBills => {
                            let modifiableTraderBills = [];
                            let count = 0;
                            let totalAmount = 0.0;
                            let totalRecipientAmount = 0.0;
                            let totalChargedAmount = 0.0;

                            if (traderBills) {
                                for (let traderBill of traderBills) {
                                    const traderPayProof = await TraderPayProofs.findOne({
                                        where: { TraderBillID: traderBill.TraderBillID }
                                    });

                                    const traderPayDetails = await TraderPayDetails.findOne({
                                        where: {  TraderBillID: traderBill.TraderBillID }
                                    });

                                    let paymentMethod = "Unavailable";

                                    if (traderPayProof) {
                                        paymentMethod = "Bank Transfer";
                                    }
                                    else if (traderPayDetails) {
                                        paymentMethod = "Credit Card";
                                    }

                                    let amount = traderBill.Amount;
                                    let feeRate = traderBill.FeeRate;
                                    let chargedAmount = amount * (feeRate / 100);
                                    let recipientAmount = amount - chargedAmount;

                                    totalAmount += amount;
                                    totalRecipientAmount += recipientAmount;
                                    totalChargedAmount += chargedAmount;

                                    let modifiableTraderBill = traderBill.dataValues;
                                    modifiableTraderBill.ChargedAmount = chargedAmount;
                                    modifiableTraderBill.RecipientAmount = recipientAmount;
                                    modifiableTraderBill.PaymentMethod = paymentMethod;

                                    modifiableTraderBills[count++] = modifiableTraderBill;
                                }
                            }

                            let traderAccountStatement = {
                                Trader: trader,
                                Bills: modifiableTraderBills,
                                TotalAmount: totalAmount,
                                TotalRecipientAmount: totalRecipientAmount,
                                TotalChargedAmount: totalChargedAmount
                            };

                            response.json({
                                Message: "Account statement found.",
                                AccountStatement: traderAccountStatement
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Trader not found."
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