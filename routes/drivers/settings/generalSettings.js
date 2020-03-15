const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../../../models/drivers");
const tokenGenerator = require("../../../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: generalSettings
router.post("/generalSettings", (req, res) => {
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
                    console.log(driver);

                    let updatedDriver = {
                        FirstName: req.body.FirstName,
                        LastName: req.body.LastName,
                        Address: req.body.Address,
                        PhoneNumber: req.body.PhoneNumber,
                        Gender: req.body.Gender,
                        Nationality: req.body.Nationality,
                        DateOfBirth: req.body.DateOfBirth,
                    }

                    Drivers.update(updatedDriver, { where: { DriverID: driverToken.DriverID } }).then(() => {
                            tokenGenerator.generateDriverToken(driver.DriverID, token => {
                                res.json({
                                    Message: "driver is updated.",
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