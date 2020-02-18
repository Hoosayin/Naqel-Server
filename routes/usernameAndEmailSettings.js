const express = require("express");
const cors = require("cors");
const Drivers = require("../models/drivers");
const tokenGenerator = require("../helpers/tokenGenerator

var router = express.Router();
router.use(cors());

// POST: usernameAndEmailSettings
router.post("/dashboard/usernameAndEmailSettings", (req, res, next) => {
    try {
        let driverToken = jwtDecode(req.body.Token);

        Drivers.findOne({
            where: { DriverID: driverToken.DriverID },
        })
            .then(driver => {
                if (!driver) {
                    res.json({
                        Message: "Driver not found."
                    });
                }
                else {
                    let updatedDriver = {
                        Username: req.body.Username,
                        Email: req.body.Email,
                    }

                    Drivers.update(updatedDriver, { where: { DriverID: req.body.DriverID } }).then(() => {
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
        return done(error);
    }
});

module.exports = router;