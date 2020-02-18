const express = require("express");
const cors = require("cors");
const Drivers = require("../models/drivers");
const bcrypt = require("bcrypt");
const tokenGenerator = require("../helpers/tokenGenerator");

const BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();
router.use(cors());

// POST: passwordSettings
router.post("/dashboard/passwordSettings", (req, res) => {
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
                bcrypt.hash(req.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                    let updatedDriver = {
                        Password: passwordHash,
                    }

                    Drivers.update(updatedDriver, { where: { DriverID: req.body.DriverID } }).then(() => {
                        tokenGenerator.generateDriverToken(driver.DriverID, token => {
                            res.json({
                                Message: "driver is updated.",
                                Token: token
                            });
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