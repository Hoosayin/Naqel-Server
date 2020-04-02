const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DrivingLicences = require("../../../models/drivingLicences.js");

var router = express.Router();
router.use(cors());

// POST: deleteDrivingLicence
router.delete("/deleteDrivingLicence", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DrivingLicences.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(drivingLicence => {
                    if (drivingLicence) {
                        drivingLicence.destroy();

                        response.json({
                            Message: "Driving Licence is deleted."
                        });
                    }
                    else {
                        response.json({
                            Message: "Driving Licence not found."
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