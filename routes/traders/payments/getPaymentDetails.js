const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderBills = require("../../../models/traderBills");
const TraderPayProofs = require("../../../models/traderPayProofs");

var router = express.Router();
router.use(cors());

// GET: getPaymentDetails
router.get("/getPaymentDetails", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, async result => {
        try {
            if (result.Message === "Trader found.") {
                TraderBills.findOne({
                    where: { TraderBillID: request.query.TraderBillID }
                }).then(traderBill => {
                    if (traderBill) {
                        TraderPayProofs.findOne({
                            where: { TraderBillID: traderBill.TraderBillID }
                        }).then(traderPayProof => {
                            if (traderPayProof) {
                                let paymentDetails = {
                                    IsOnlinePayment: false,
                                    PayProof: traderPayProof
                                };

                                response.json({
                                    Message: "Payment details found.",
                                    PaymentDetails: paymentDetails
                                });
                            }
                            else {
                                response.json({
                                    Message: "Trader pay proof not found."
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