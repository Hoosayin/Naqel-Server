const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverPermitLicences = require("../../../models/driverPermitLicences");

var router = express.Router();
router.use(cors());

// POST: deletePermitLicence
router.delete("/deletePermitLicence", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverPermitLicences.findOne({
                    where: { PermitLicenceID: request.body.PermitLicenceID }
                }).then(driverPermitLicence => {
                    if (driverPermitLicence) {
                        driverPermitLicence.destroy();

                        response.json({
                            Message: "Permit Licence is deleted."
                        });
                    }
                    else {
                        response.json({
                            Message: "Permit Licence not found."
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