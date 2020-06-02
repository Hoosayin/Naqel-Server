const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderBills = require("../../../models/traderBills");
const SpecialTraderBills = require("../../../models/specialTraderBills");

var router = express.Router();
router.use(cors());

// POST: requestSpecialBill
router.post("/requestSpecialBill", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                TraderBills.findOne({
                    attributes: ["TraderBillID"],
                    where: { TraderBillID: request.body.TraderBillID }
                }).then(traderBill => {
                    if (traderBill) {
                        SpecialTraderBills.findOne({
                            where: { TraderBillID: traderBill.TraderBillID }
                        }).then(specialTraderBill => {
                            if (specialTraderBill) {
                                response.json({
                                    Message: "Special bill is already requested."
                                });
                            }
                            else {
                                let newSpecialTraderBill = {
                                    TraderBillID: traderBill.TraderBillID,
                                    Amount: request.body.Amount,
                                    Created: new Date()
                                };

                                SpecialTraderBills.create(newSpecialTraderBill).then(specialTraderBill => {
                                    response.json({
                                        Message: "Special bill is requested.",
                                        SpecialTraderBill: specialTraderBill
                                    });
                                })
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
                Message: error.message,
            });
        }
    })(request, response);
});

module.exports = router;