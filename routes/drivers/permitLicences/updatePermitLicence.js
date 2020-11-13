const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverPermitLicences = require("../../../models/driverPermitLicences");

var router = express.Router();
router.use(cors());

// POST: updatePermitLicence
router.post("/updatePermitLicence", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverPermitLicences.findOne({
                    where: { PermitLicenceID: request.body.PermitLicenceID }
                }).then(driverPermitLicence => {
                    if (driverPermitLicence) {
                        let updatedPermitLicence = {
                            PermitNumber: request.body.PermitNumber,
                            ExpiryDate: request.body.ExpiryDate,
                            PhotoURL: request.body.PhotoURL,
                            Type: request.body.Type,
                            Place: request.body.Place
                        };

                        DriverPermitLicences.update(updatedPermitLicence, { where: { PermitLicenceID: driverPermitLicence.PermitLicenceID } }).then(() => {
                            response.json({
                                Message: "Permit Licence is updated."
                            });
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