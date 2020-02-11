const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../models/drivers");
const DrivingLicences = require("../models/drivingLicences");
const tokenGenerator = require("../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: deleteDrivingLicence
router.post("/dashboard/deleteDrivingLicence", (req, res) => {
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
                        drivingLicence.destroy();

                        tokenGenerator.generateDriverToken(driver.DriverID, token => {
                            res.json({
                                Message: "Driving Licence is deleted.",
                                Token: token
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