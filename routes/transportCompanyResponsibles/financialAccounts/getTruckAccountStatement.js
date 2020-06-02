const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Trucks = require("../../../models/trucks");
const CompletedJobs = require("../../../models/completedJobs");
const TraderBills = require("../../../models/traderBills");
const TraderPayProof = require("../../../models/traderPayProofs");
const DriverEarnings = require("../../../models/driverEarnings");
const DriverBills = require("../../../models/driverBills");
const DriverPayProofs = require("../../../models/driverPayProofs");

var router = express.Router();
router.use(cors());

// GET: getTruckAccountStatement
router.get("/getTruckAccountStatement", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, (result) => {
        try {
            if (result.Message === "Transport company responsible found.") {
                Trucks.findOne({
                    attributes: ["TruckID", "Brand", "Model", "ProductionYear", "Type", "TruckNumber", "PlateNumber"],
                    where: { TruckNumber: request.query.TruckNumber }
                }).then(truck => {
                    if (truck) {
                        CompletedJobs.findAll({
                            attributes: ["CompletedJobID", "JobNumber", "Created"],
                            where: { TruckID: truck.TruckID }
                        }).then(async completedJobs => {
                            if (completedJobs) {
                                let transactions = [];
                                let count = 0;

                                for (let completedJob of completedJobs) {
                                    let transaction = {
                                        Date: completedJob.Created,
                                        JobNumber: completedJob.JobNumber,
                                        TraderBillNumber: "Unavailable",
                                        TraderBillPaid: false,
                                        TraderPaymentMethod: "Unavailable",
                                        DriverBillNumber: "Unavailable",
                                        DriverBillPaid: false,
                                        DriverPaymentMethod: "Unavailable",
                                        FeeRate: 0,
                                        Earned: 0.0,
                                        Charged: 0.0,
                                        Amount: 0.0
                                    };

                                    let traderBill = await TraderBills.findOne({
                                        attributes: ["TraderBillID", "BillNumber", "Paid", "Amount", "FeeRate"],
                                        where: { CompletedJobID: completedJob.CompletedJobID }
                                    });

                                    transaction.TraderBillNumber = traderBill.BillNumber;
                                    transaction.TraderBillPaid = traderBill.Paid;
                                    transaction.Amount = traderBill.Amount;
                                    transaction.FeeRate = traderBill.FeeRate;

                                    let traderPayProof = await TraderPayProof.findOne({
                                        attributes: ["TraderPayProofID"],
                                        where: { TraderBillID: traderBill.TraderBillID }
                                    });

                                    if (traderBill.Paid) {
                                        transaction.TraderPaymentMethod = traderPayProof ? "Bank Transfer" : "Credit Card";

                                        let driverEarning = await DriverEarnings.findOne({
                                            attributes: ["DriverBillID", "Amount"],
                                            where: { CompletedJobID: completedJob.CompletedJobID }
                                        });

                                        transaction.Earned = driverEarning.Amount;
                                        transaction.Charged = traderBill.Amount - driverEarning.Amount;

                                        if (driverEarning.DriverBillID) {
                                            let driverBill = DriverBills.findOne({
                                                attributes: ["DriverBillID", "Paid", "BillNumber"],
                                                where: { DriverBillID: driverEarning.DriverBillID }
                                            });

                                            transaction.DriverBillNumber = driverBill.BillNumber;
                                            transaction.DriverBillPaid = driverBill.Paid;

                                            if (driverBill.Paid) {
                                                let driverPayProof = await DriverPayProofs.findOne({
                                                    attributes: ["DriverPayProofID"],
                                                    where: { DriverBillID: driverBill.DriverBillID }
                                                });

                                                transaction.DriverPaymentMethod = driverPayProof ? "Bank Transfer" : "Credit Card";
                                            }
                                        }
                                    }

                                    transactions[count++] = transaction;
                                }

                                if (transactions.length > 0) {
                                    transactions.sort((a, b) => {
                                        let dateA = new Date(a.Date);
                                        let dateB = new Date(b.Date);
                                        return dateB - dateA;
                                    });
                                }

                                let accountStatement = {
                                    Truck: truck,
                                    Transactions: transactions
                                };

                                response.json({
                                    Message: "Account statement found.",
                                    AccountStatement: accountStatement
                                });

                            }
                            else {
                                response.json({
                                    Message: "Account statement not found."
                                });
                            }
                        });
                    }
                    else {
                        response.json({
                            Message: "Truck not found."
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