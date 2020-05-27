const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverBills = require("../../../models/driverBills");
const Drivers = require("../../../models/drivers");
const DriverPayProofs = require("../../../models/driverPayProofs");
const DriverPayDetails = require("../../../models/driverPayDetails");

var router = express.Router();
router.use(cors());

// GET: getDriversBills
router.get("/getDriversBills", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                DriverBills.findAll().then(async driverBills => {
                    if (driverBills) {
                        let modifiableDriverBills = [];
                        let count = 0;

                        for (let driverBill of driverBills) {
                            const driver = await Drivers.findOne({
                                attributes: ["Username"],
                                where: { DriverID: driverBill.DriverID }
                            });

                            const driverPayProof = await DriverPayProofs.findOne({
                                where: { DriverBillID: driverBill.DriverBillID }
                            });

                            const driverPayDetails = await DriverPayDetails.findOne({
                                where: { DriverBillID: driverBill.DriverBillID }
                            });

                            let modifiableDriverBill = driverBill.dataValues;
                            modifiableDriverBill.Username = driver.Username;
                            modifiableDriverBill.DriverPayProof = driverPayProof;
                            modifiableDriverBill.DriverPayDetails = driverPayDetails;

                            modifiableDriverBills[count++] = modifiableDriverBill;
                        }

                        if (modifiableDriverBills.length > 0) {
                            modifiableDriverBills.sort((a, b) => {
                                let dateA = new Date(a.Created);
                                let dateB = new Date(b.Created);
                                return dateB - dateA;
                            });
                        }

                        response.json({
                            Message: "Bills found.",
                            Bills: modifiableDriverBills
                        });

                    }
                    else {
                        response.json({
                            Message: "Bills not found."
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