const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderBills = require("../../../models/traderBills");
const TraderPayProofs = require("../../../models/traderPayProofs"); 

var router = express.Router();
router.use(cors());

// POST: addTraderPayProof
router.post("/addTraderPayProof", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                TraderBills.findOne({
                    where: { TraderBillID: request.body.TraderBillID }
                }).then(traderBill => {
                    if (traderBill) {
                        TraderPayProofs.findOne({
                            where: { TraderBillID: traderBill.TraderBillID }
                        }).then(traderPayProof => {
                            if (traderPayProof) {
                                response.json({
                                    Message: "Trader pay proof already exists."
                                });
                            }
                            else {
                                let newTraderPayProof = {
                                    TraderBillID: traderBill.TraderBillID,
                                    PhotoURL: request.body.PhotoURL,
                                    Approved: false,
                                    Created: new Date()
                                };

                                TraderPayProofs.create(newTraderPayProof).then(() => {
                                    response.json({
                                        Message: "Trader pay proof is added."
                                    });
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
                Message: error.message,
            });
        }
    })(request, response);
});

module.exports = router;