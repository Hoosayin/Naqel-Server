const express = require("express");
const cors = require("cors");
const uuid = require("uuid-v4");
const passport = require("../../../helpers/passportHelper");
const TraderPayProofs = require("../../../models/traderPayProofs");
const TraderBills = require("../../../models/traderBills");
const DriverBills = require("../../../models/driverBills");
const DriverEarnings = require("../../../models/driverEarnings");

var router = express.Router();
router.use(cors());

// POST: approveTraderPayProof
router.post("/approveTraderPayProof", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                TraderPayProofs.findOne({
                    where: { TraderPayProofID: request.body.TraderPayProofID }
                }).then(traderPayProof => {
                    if (traderPayProof) {
                        TraderBills.findOne({
                            where: { TraderBillID: traderPayProof.TraderBillID }
                        }).then(traderBill => {
                            if (traderBill) {
                                let amount = traderBill.Amount;
                                let feeRate = traderBill.FeeRate;

                                let driverBillAmount = amount * (feeRate / 100);
                                let driverEarning = amount - driverBillAmount;

                                let newDriverBill = {
                                    DriverID: result.Driver.DriverID,
                                    CompletedJobID: traderBill.CompletedJobID,
                                    Amount: driverBillAmount,
                                    Paid: false,
                                    BillNumber: uuid().substring(0, 8).toUpperCase(),
                                    FeeRate: feeRate,
                                    Created: new Date()
                                };

                                DriverBills.create(newDriverBill).then(driverBill => {
                                    let newDriverEarning = {
                                        DriverID: result.Driver.DriverID,
                                        CompletedJobID: traderBill.CompletedJobID,
                                        DriverBillID: driverBill.DriverBillID,
                                        Amount: driverEarning,
                                        Created: new Date()
                                    };

                                    DriverEarnings.create(newDriverEarning).then(() => {
                                        let updatedTraderBill = {
                                            Paid: true
                                        };

                                        TraderBills.update(updatedTraderBill, { where: { TraderBillID: traderBill.TraderBillID } }).then(() => {
                                            let updatedTraderPayProof = {
                                                Approved: true
                                            };

                                            TraderPayProofs.update(updatedTraderPayProof, { where: { TraderPayProofID: traderPayProof.TraderPayProofID } }).then(() => {
                                                response.json({
                                                    Message: "Trader pay proof is approved."
                                                });
                                            });
                                        });
                                    }); 
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
                            Message: "Trader pay proof not found."
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