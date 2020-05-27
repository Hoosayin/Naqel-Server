const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");
const DriverEarnings = require("../../../models/driverEarnings");
const DriverBills = require("../../../models/driverBills");
const CompletedJobs = require("../../../models/completedJobs");
const DriverPayProofs = require("../../../models/driverPayProofs");
const DriverPayDetails = require("../../../models/driverPayDetails");

var router = express.Router();
router.use(cors());

// GET: getDriverAccountStatement
router.get("/getDriverAccountStatement", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                Drivers.findOne({
                    attributes: ["DriverID", "Username", "FirstName", "LastName", "Address"],
                    where: { Username: request.query.Username }
                }).then(driver => {
                    if (driver) {
                        DriverEarnings.findAll({
                            where: { DriverID: driver.DriverID }
                        }).then(async driverEarnings => {
                            let bills = [];
                            let count = 0;
                            let netEarning = 0.0;
                            let netAmount = 0.0;

                            if (driverEarnings) {
                                for (let driverEarning of driverEarnings) {
                                    const completedJob = await CompletedJobs.findOne({
                                        attributes: ["JobNumber"],
                                        where: { CompletedJobID: driverEarning.CompletedJobID }
                                    });

                                    let billData = {
                                        JobNumber: completedJob.JobNumber,
                                        AmountEarned: driverEarning.Amount,
                                        BillNumber: "Unavailable",
                                        Paid: false,
                                        PaymentMethod: "Unavailable",
                                        AmountCharged: 0.0,
                                        Created: driverEarning.Created
                                    };

                                    if (driverEarning.DriverBillID) {
                                        const driverBill = await DriverBills.findOne({
                                            where: { DriverBillID: driverEarning.DriverBillID }
                                        });

                                        const driverPayProof = await DriverPayProofs.findOne({
                                            where: { DriverBillID: driverBill.DriverBillID }
                                        });

                                        const driverPayDetails = await DriverPayDetails.findOne({
                                            where: { DriverBillID: driverBill.DriverBillID }
                                        });

                                        if (driverPayProof) {
                                            billData.PaymentMethod = "Bank Transfer"
                                        }
                                        else if (driverPayDetails) {
                                            billData.PaymentMethod = "Credit Card"
                                        }

                                        billData.BillNumber = driverBill.BillNumber;
                                        billData.Paid = driverBill.Paid;
                                        billData.AmountCharged = driverBill.Amount;

                                        netAmount += driverBill.Amount;
                                    }

                                    netEarning += driverEarning.Amount;
                                    

                                    bills[count++] = billData;
                                }
                            }

                            let driverAccountStatement = {
                                Driver: driver,
                                Bills: bills,
                                NetEarning: netEarning,
                                NetAmount: netAmount
                            };

                            response.json({
                                Message: "Account statement found.",
                                AccountStatement: driverAccountStatement
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Driver not found."
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