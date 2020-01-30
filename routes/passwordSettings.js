const express = require("express");
const cors = require("cors");
const Drivers = require("../models/drivers");
const bcrypt = require("bcrypt");

const BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();
router.use(cors());

// POST: passwordSettings
router.post("/dashboard/passwordSettings", (req, res) => {
    try {
        Drivers.findOne({
            where: { DriverID: req.body.DriverID },
        }).then(driver => {
            if (!driver) {
                res.send("Driver not found.");
            }
            else {
                bcrypt.hash(req.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                    let updatedDriver = {
                        Password: passwordHash,
                    }

                    Drivers.update(updatedDriver, { where: { DriverID: req.body.DriverID } }).then(() => {
                        console.log("Driver is updated in database.");
                        res.send("Driver is updated.");
                    });
                });
            }
        });
    } catch (error) {
        return res.send(error);
    }
});

module.exports = router;