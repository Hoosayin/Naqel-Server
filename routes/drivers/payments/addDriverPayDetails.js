const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverBills = require("../../../models/driverBills");
const DriverPayDetails = require("../../../models/driverPayDetails"); 
const NaqelTransactions = require("../../../models/naqelTransactions");

var router = express.Router();
router.use(cors());

// POST: addDriverPayDetails
router.post("/addDriverPayDetails", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverBills.findOne({
                    where: { DriverBillID: request.body.DriverBillID }
                }).then(driverBill => {
                    if (driverBill) {
                        DriverPayDetails.findOne({
                            where: { DriverBillID: driverBill.DriverBillID }
                        }).then(driverPayDetail => {
                            if (driverPayDetail) {
                                response.json({
                                    Message: "Driver pay details already exists."
                                });
                            }
                            else {
                                let newDriverPayDetail = {
                                    DriverBillID: driverBill.DriverBillID,
                                    CardType: request.body.CardType,
                                    OwnerName: request.body.OwnerName,
                                    OwnerEmail: request.body.OwnerEmail,
                                    Created: new Date()
                                };

                                DriverPayDetails.create(newDriverPayDetail).then(() => {
                                    let updatedDriverBill = {
                                        Paid: true
                                    };

                                    DriverBills.update(updatedDriverBill, { where: { DriverBillID: driverBill.DriverBillID } }).then(() => {
                                        let newNaqelTransaction = {
                                            DriverID: result.Driver.DriverID,
                                            TraderID: null,
                                            UserType: "Driver",
                                            BillNumber: driverBill.BillNumber,
                                            PaymentMethod: "Credit Card",
                                            Amount: driverBill.Amount,
                                            Created: new Date()
                                        };

                                        NaqelTransactions.create(newNaqelTransaction).then(() => {
                                            response.json({
                                                Message: "Pay details are added."
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                    else {
                        response.json({
                            Message: "Driver bill not found."
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