const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Drivers = require("../../../models/drivers");

var router = express.Router();
router.use(cors());

// POST: validatePassword
router.post("/validatePassword", (req, res) => {
    try {
        Drivers.findOne({
            where: { DriverID: req.body.DriverID },
        })
            .then(driver => {
                if (driver) {
                    bcrypt.compare(req.body.Password, driver.Password)
                        .then(response => {
                            if (!response) {
                                res.send("Invalid password.");
                            }
                            else {
                                res.send("Valid password.");
                            }
                        });
                }
                else {
                    res.send("Driver not found.");
                }
            });
    } catch (error) {
        return res.send(error);
    }
});

module.exports = router;