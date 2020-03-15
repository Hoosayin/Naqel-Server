const express = require("express");
const cors = require("cors");
const passport = require("../../helpers/passportHelper");
const Drivers = require("../../models/drivers");

var router = express.Router();
router.use(cors());

// POST: accountSetup
router.post("/accountSetup", (req, res, next) => {
    passport.authenticate("accountSetup", (error, driver, information) => {
        if (error) {
            console.error(`error: ${error}`);
        }

        req.logIn(driver, error => {
            console.log(driver);

            const newDriver = {
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                Email: req.body.Email,
                Address: req.body.Address,
                PhoneNumber: req.body.PhoneNumber,
                Gender: req.body.Gender,
                Nationality: req.body.Nationality,
                Username: driver.Username,
                Active: '1',
            };

            console.log(newDriver);

            if (req.body.RegisterAs == "Driver") {
                Drivers.findOne({
                    where: { Username: newDriver.Username },
                }).then(driver => {
                    console.log(driver);

                    let updatedDriver = {
                        FirstName: req.body.FirstName,
                        LastName: req.body.LastName,
                        Email: req.body.Email,
                        Address: req.body.Address,
                        PhoneNumber: req.body.PhoneNumber,
                        Gender: req.body.Gender,
                        Nationality: req.body.Nationality,
                    };

                    Drivers.update(updatedDriver, { where: { Username: newDriver.Username } }).then(() => {
                        console.log("New driver created in database.");
                        res.send("Driver created.");
                    });
                });
            }
            if (req.body.RegisterAs == "Trader" ||
                req.body.RegisterAs == "Broker") {
                console.log("New Trader/Broker created in database.");
                res.send("Trader/Broker created.");
            }
        });
    })(req, res, next);
});

module.exports = router;