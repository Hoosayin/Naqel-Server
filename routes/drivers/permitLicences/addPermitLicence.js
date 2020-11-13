const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverPermitLicences = require("../../../models/driverPermitLicences");

var router = express.Router();
router.use(cors());

// POST: addPermitLicence
router.post("/addPermitLicence", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                let newPermitLicence = {
                    DriverID: result.Driver.DriverID,
                    PermitNumber: request.body.PermitNumber,
                    ExpiryDate: request.body.ExpiryDate,
                    PhotoURL: request.body.PhotoURL,
                    Type: request.body.Type,
                    Place: request.body.Place
                };

                DriverPermitLicences.create(newPermitLicence).then(() => {
                    response.json({
                        Message: "Permit Licence is added."
                    });
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