const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../models/drivers");
const DriverPermitLicences = require("../models/driverPermitLicences");
const tokenGenerator = require("../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: addPermitLicence
router.post("/dashboard/addPermitLicence", (req, res) => {
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
                let newPermitLicence = {
                    DriverID: driver.DriverID,
                    PermitNumber: req.body.PermitNumber,
                    ExpiryDate: req.body.ExpiryDate,
                    PhotoURL: req.body.PhotoURL,
                };

                DriverPermitLicences.create(newPermitLicence).then(() => {
                    tokenGenerator.generateDriverToken(driver.DriverID, token => {
                        res.json({
                            Message: "Permit Licence is added.",
                            Token: token
                        });
                    });
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