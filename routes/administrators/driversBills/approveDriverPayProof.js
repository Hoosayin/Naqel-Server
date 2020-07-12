const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverBills = require("../../../models/driverBills");
const DriverPayProofs = require("../../../models/driverPayProofs");
const NaqelTransactions = require("../../../models/naqelTransactions");

var router = express.Router();
router.use(cors());

// POST: appriveDriverPayProof
router.post("/approveDriverPayProof", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                DriverPayProofs.findOne({
                    where: { DriverPayProofID: request.body.DriverPayProofID }
                }).then(driverPayProof => {
                    if (driverPayProof) {
                        DriverBills.findOne({
                            where: { DriverBillID: driverPayProof.DriverBillID }
                        }).then(driverBill => {
                            if (driverBill) {
                                let updatedDriverBill = {
                                    Paid: true
                                };

                                DriverBills.update(updatedDriverBill, { where: { DriverBillID: driverBill.DriverBillID } }).then(() => {
                                    let updatedDriverPayProof = {
                                        Approved: true
                                    };

                                    DriverPayProofs.update(updatedDriverPayProof, { where: { DriverPayProofID: driverPayProof.DriverPayProofID } }).then(() => {
                                        let newNaqelTransaction = {
                                            DriverID: driverBill.DriverID,
                                            TraderID: null,
                                            UserType: "Driver",
                                            BillNumber: driverBill.BillNumber,
                                            PaymentMethod: "Bank Transfer",
                                            Amount: driverBill.Amount,
                                            Created: new Date()
                                        };

                                        NaqelTransactions.create(newNaqelTransaction).then(() => {
                                            response.json({
                                                Message: "Driver pay proof is approved."
                                            });
                                        });
                                    });
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
                            Message: "Driver pay proof not found."
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