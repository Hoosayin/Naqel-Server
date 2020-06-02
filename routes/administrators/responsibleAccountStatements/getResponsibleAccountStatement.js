const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TransportCompanyResponsibles = require("../../../models/transportCompanyResponsibles");
const Trucks = require("../../../models/trucks");
const CompletedJobs = require("../../../models/completedJobs");
const TraderBills = require("../../../models/traderBills");
const TraderPayProof = require("../../../models/traderPayProofs");
const DriverEarnings = require("../../../models/driverEarnings");
const DriverBills = require("../../../models/driverBills");
const DriverPayProofs = require("../../../models/driverPayProofs");

var router = express.Router();
router.use(cors());

// GET: getResponsibleAccountStatement
router.get("/getResponsibleAccountStatement", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, (result) => {
        try {
            if (result.Message === "Administrator found.") {
                TransportCompanyResponsibles.findOne({
                    where: { Username: request.query.Username }
                }).then(transportCompanyResponsible => {
                    if (transportCompanyResponsible) {
                        Trucks.findAll({
                            attributes: ["TruckID", "TruckNumber"],
                            where: { TransportCompanyResponsibleID: transportCompanyResponsible.TransportCompanyResponsibleID }
                        }).then(async trucks => {
                            if (trucks) {
                                let transactions = [];
                                let count = 0;

                                for (let truck of trucks) {
                                    const completedJobs = await CompletedJobs.findAll({
                                        attributes: ["CompletedJobID", "JobNumber", "Created"],
                                        where: { TruckID: truck.TruckID }
                                    });

                                    if (completedJobs) {
                                        for (let completedJob of completedJobs) {
                                            let transaction = {
                                                Date: completedJob.Created,
                                                TruckNumber: truck.TruckNumber,
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
                                    }
                                }

                                if (transactions.length > 0) {
                                    transactions.sort((a, b) => {
                                        let dateA = new Date(a.Date);
                                        let dateB = new Date(b.Date);
                                        return dateB - dateA;
                                    });
                                }

                                let accountStatement = {
                                    TransportCompany: transportCompanyResponsible,
                                    Transactions: transactions
                                };

                                response.json({
                                    Message: "Account statement found.",
                                    AccountStatement: accountStatement
                                });
                            }
                            else {
                                response.json({
                                    Message: "Trucks not found."
                                });
                            }
                        });
                    }
                    else {
                        response.json({
                            Message: "Transport company responsible not found."
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