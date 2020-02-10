const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../models/drivers");
const DrivingLicences = require("../models/drivingLicences");
const tokenGenerator = require("../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: updateDrivingLicence
router.post("/dashboard/updateDrivingLicence", (req, res) => {
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
                        let updatedDrivingLicence = {
                            LicenceNumber: req.body.LicenceNumber,
                            Type: req.body.Type,
                            ReleaseDate: req.body.ReleaseDate,
                            ExpiryDate: req.body.ExpiryDate,
                            PhotoURL: req.body.PhotoURL
                        };

                        DrivingLicences.update(updatedDrivingLicence, { where: { DrivingLicenceID: drivingLicence.DrivingLicenceID } }).then(() => {
                            tokenGenerator.generateDriverToken(driver.DriverID, token => {
                                res.json({
                                    Message: "Driving Licence is updated.",
                                    Token: token
                                });
                            });
                        });
                        
                    }
                    else {
                        res.json({
                            Message: "Driving Licence not found."
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