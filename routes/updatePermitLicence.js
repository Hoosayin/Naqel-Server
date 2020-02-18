const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../models/drivers");
const DrivingLicences = require("../models/drivingLicences");
const DriverPermitLicences = require("../models/driverPermitLicences");
const tokenGenerator = require("../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: updatePermitLicence
router.post("/dashboard/updatePermitLicence", (req, res) => {
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
                DriverPermitLicences.findOne({
                    where: { PermitLicenceID: req.body.PermitLicenceID }
                }).then(driverPermitLicence => {
                    if (driverPermitLicence) {
                        let updatedPermitLicence = {
                            PermitNumber: req.body.PermitNumber,
                            ExpiryDate: req.body.ExpiryDate,
                            PhotoURL: req.body.PhotoURL,
                            Code: req.body.Code,
                            Place: req.body.Place
                        };

                        DriverPermitLicences.update(updatedPermitLicence, { where: { PermitLicenceID: driverPermitLicence.PermitLicenceID } }).then(() => {
                            tokenGenerator.generateDriverToken(driver.DriverID, token => {
                                res.json({
                                    Message: "Permit Licence is updated.",
                                    Token: token
                                });
                            });
                        });
                        
                    }
                    else {
                        res.json({
                            Message: "Permit Licence not found."
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