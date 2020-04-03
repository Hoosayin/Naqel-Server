const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverPermitLicences = require("../../../models/driverPermitLicences");

var router = express.Router();
router.use(cors());

// GET: getPermitLicences
router.get("/getPermitLicences", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverPermitLicences.findAll({
                    where: { Driver: result.Driver.DriverID }
                }).then(driverPermitLicences => {
                    if (driverPermitLicences) {
                        for (driverPermitLicence in driverPermitLicences) {
                            driverPermitLicence = driverPermitLicence.dataValues;
                        }

                        response.json({
                            Message: "Permit licences found.",
                            PermitLicences: driverPermitLicences
                        });
                    }
                    else {
                        response.json({
                            Message: "Permit licences not found."
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