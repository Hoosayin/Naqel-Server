const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DrivingLicences = require("../../../models/drivingLicences");

var router = express.Router();
router.use(cors());

// POST: addDrivingLicence
router.post("/addDrivingLicence", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DrivingLicences.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(drivingLicence => {
                    if (drivingLicence) {
                        response.json({
                            Message: "Driving Licence already exists."
                        });
                    }
                    else {
                        let newDrivingLicence = {
                            DriverID: result.Driver.DriverID,
                            LicenceNumber: request.body.LicenceNumber,
                            Type: "",
                            ReleaseDate: new Date(),
                            ExpiryDate: request.body.ExpiryDate,
                            PhotoURL: request.body.PhotoURL,
                            Created: new Date()
                        };

                        DrivingLicences.create(newDrivingLicence).then(() => {
                            response.json({
                                Message: "Driving Licence is added."
                            });
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