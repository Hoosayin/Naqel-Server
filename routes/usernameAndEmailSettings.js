const express = require("express");
const cors = require("cors");
const passport = require("../helpers/passportHelper");
const Drivers = require("../models/drivers");


var router = express.Router();
router.use(cors());

// POST: usernameAndEmailSettings
router.post("/dashboard/usernameAndEmailSettings", (req, res, next) => {
    try {
        Drivers.findOne({
            where: { DriverID: req.body.DriverID },
        })
            .then(driver => {
                if (!driver) {
                    res.send("Driver not found.");
                }
                else {
                    let updatedDriver = {
                        Username: req.body.Username,
                        Email: req.body.Email,
                    }

                    Drivers.update(updatedDriver, { where: { DriverID: req.body.DriverID } })
                        .then(() => {
                            console.log("Driver is updated in database.");
                            res.send("Driver is updated.");
                        });
                }
            });
    } catch (error) {
        return done(error);
    }
});

module.exports = router;