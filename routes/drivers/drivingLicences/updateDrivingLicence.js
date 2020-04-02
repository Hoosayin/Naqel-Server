const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DrivingLicences = require("../../../models/drivingLicences");

var router = express.Router();
router.use(cors());

// POST: updateDrivingLicence
router.post("/updateDrivingLicence", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DrivingLicences.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(drivingLicence => {
                    if (drivingLicence) {
                        let updatedDrivingLicence = {
                            LicenceNumber: request.body.LicenceNumber,
                            Type: request.body.Type,
                            ReleaseDate: request.body.ReleaseDate,
                            ExpiryDate: request.body.ExpiryDate,
                            PhotoURL: request.body.PhotoURL
                        };

                        DrivingLicences.update(updatedDrivingLicence, { where: { DrivingLicenceID: drivingLicence.DrivingLicenceID } }).then(() => {
                            response.json({
                                Message: "Driving Licence is updated."
                            });
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