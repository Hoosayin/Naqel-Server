const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DrivingLicences = require("../../../models/drivingLicences");

var router = express.Router();
router.use(cors());

// GET: getDrivingLicence
router.get("/getDrivingLicence", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DrivingLicences.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(drivingLicence => {
                    if (drivingLicence) {
                        response.json({
                            Message: "Driving Licence found.",
                            DrivingLicence: drivingLicence
                        });
                    }
                    else {
                        response.json({
                            Message: "Driving licence not found."
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