const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverBills = require("../../../models/driverBills");
const DriverPayProofs = require("../../../models/driverPayProofs");

var router = express.Router();
router.use(cors());

// GET: getPaymentDetails
router.get("/getPaymentDetails", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, async result => {
        try {
            if (result.Message === "Driver found.") {
                DriverBills.findOne({
                    where: { DriverBillID: request.query.DriverBillID }
                }).then(driverBill => {
                    if (driverBill) {
                        DriverPayProofs.findOne({
                            where: { DriverBillID: driverBill.DriverBillID }
                        }).then(driverPayProof => {
                            if (driverPayProof) {
                                let paymentDetails = {
                                    IsOnlinePayment: false,
                                    PayProof: driverPayProof
                                };

                                response.json({
                                    Message: "Payment details found.",
                                    PaymentDetails: paymentDetails
                                });
                            }
                            else {
                                response.json({
                                    Message: "Driver pay proof not found."
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
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;