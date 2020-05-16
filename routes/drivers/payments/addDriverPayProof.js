const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverBills = require("../../../models/driverBills");
const DriverPayProofs = require("../../../models/driverPayProofs"); 

var router = express.Router();
router.use(cors());

// POST: addDriverPayProof
router.post("/addDriverPayProof", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverBills.findOne({
                    where: { DriverBillID: request.body.DriverBillID }
                }).then(driverBill => {
                    if (driverBill) {
                        DriverPayProofs.findOne({
                            where: { DriverBillID: driverBill.DriverBillID }
                        }).then(driverPayProof => {
                            if (driverPayProof) {
                                response.json({
                                    Message: "Driver pay proof already exists."
                                });
                            }
                            else {
                                let newDriverPayProof = {
                                    DriverBillID: driverBill.DriverBillID,
                                    PhotoURL: request.body.PhotoURL,
                                    Approved: false,
                                    Created: new Date()
                                };

                                DriverPayProofs.create(newDriverPayProof).then(() => {
                                    response.json({
                                        Message: "Driver pay proof is added."
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