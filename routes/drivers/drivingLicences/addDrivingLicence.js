const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../../../models/drivers");
const DrivingLicences = require("../../../models/drivingLicences");
const tokenGenerator = require("../../../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: addDrivingLicence
router.post("/addDrivingLicence", (req, res) => {
    try {
        let driverToken = jwtDecode(req.body.Token);

        Drivers.findOne({
            where: { DriverID: driverToken.DriverID },
        }).then(driver => {
            if (!driver) {
                res.json({
                    Message: "Driver not found."
                });
            }
            else {
                DrivingLicences.findOne({
                    where: { DriverID: driver.DriverID }
                }).then(drivingLicence => {
                    if (drivingLicence) {
                        res.json({
                            Message: "Driving Licence already exists."
                        });
                    }
                    else {
                        let newDrivingLicence = {
                            DriverID: driver.DriverID,
                            LicenceNumber: req.body.LicenceNumber,
                            Type: req.body.Type,
                            ReleaseDate: req.body.ReleaseDate,
                            ExpiryDate: req.body.ExpiryDate,
                            PhotoURL: req.body.PhotoURL,
                            Created: new Date()
                        };

                        DrivingLicences.create(newDrivingLicence).then(() => {
                            tokenGenerator.generateDriverToken(driver.DriverID, token => {
                                res.json({
                                    Message: "Driving Licence is added.",
                                    Token: token
                                });
                            });
                        });
                    }
                });
            }
        });
    } catch (error) {
        return res.json({
            Message: error
        });
    }
});

module.exports = router;