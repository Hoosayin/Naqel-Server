const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderBills = require("../../../models/traderBills");
const TraderPayDetails = require("../../../models/traderPayDetails"); 
const DriverEarnings = require("../../../models/driverEarnings");
const NaqelTransactions = require("../../../models/naqelTransactions");

var router = express.Router();
router.use(cors());

// POST: addTraderPayDetails
router.post("/addTraderPayDetails", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                TraderBills.findOne({
                    where: { TraderBillID: request.body.TraderBillID }
                }).then(traderBill => {
                    if (traderBill) {
                        TraderPayDetails.findOne({
                            where: { TraderBillID: traderBill.TraderBillID }
                        }).then(traderPayDetail => {
                            if (traderPayDetail) {
                                response.json({
                                    Message: "Trader pay details already exists."
                                });
                            }
                            else {
                                const amount = traderBill.Amount;
                                const feeRate = traderBill.FeeRate;

                                const driverBillAmount = amount * (feeRate / 100);
                                const driverEarning = amount - driverBillAmount;

                                let newDriverEarning = {
                                    DriverID: traderBill.DriverID,
                                    CompletedJobID: traderBill.CompletedJobID,
                                    DriverBillID: null,
                                    Amount: driverEarning,
                                    Created: new Date()
                                };

                                DriverEarnings.create(newDriverEarning).then(() => {
                                    let newTraderPayDetail = {
                                        TraderBillID: traderBill.TraderBillID,
                                        CardType: request.body.CardType,
                                        OwnerName: request.body.OwnerName,
                                        OwnerEmail: request.body.OwnerEmail,
                                        Created: new Date()
                                    };

                                    TraderPayDetails.create(newTraderPayDetail).then(() => {
                                        let updatedTraderBill = {
                                            Paid: true
                                        };

                                        TraderBills.update(updatedTraderBill, { where: { TraderBillID: traderBill.TraderBillID } }).then(() => {
                                            let newNaqelTransaction = {
                                                DriverID: null,
                                                TraderID: result.Trader.TraderID,
                                                UserType: result.Trader.Type,
                                                BillNumber: traderBill.BillNumber,
                                                PaymentMethod: "Credit Card",
                                                Amount: driverBillAmount,
                                                Created: new Date()
                                            };

                                            NaqelTransactions.create(newNaqelTransaction).then(() => {
                                                response.json({
                                                    Message: "Pay details are added."
                                                });
                                            });
                                        });
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