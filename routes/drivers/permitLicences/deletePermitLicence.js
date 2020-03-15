const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../../../models/drivers");
const DriverPermitLicences = require("../../../models/driverPermitLicences");
const tokenGenerator = require("../../../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: deletePermitLicence
router.post("/deletePermitLicence", (req, res) => {
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
                        driverPermitLicence.destroy();

                        tokenGenerator.generateDriverToken(driver.DriverID, token => {
                            res.json({
                                Message: "Permit Licence is deleted.",
                                Token: token
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