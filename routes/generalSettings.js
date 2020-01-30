const express = require("express");
const cors = require("cors");
const passport = require("../helpers/passportHelper");
const Drivers = require("../models/drivers");


var router = express.Router();
router.use(cors());

// POST: generalSettings
router.post("/dashboard/generalSettings", (req, res, next) => {
    try {
        Drivers.findOne({
            where: { DriverID: req.body.DriverID },
        })
            .then(driver => {
                if (!driver) {
                    res.send("Driver not found." );
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

                    Drivers.update(updatedDriver, { where: { DriverID: req.body.DriverID } })
                        .then(() => {
                            console.log("Driver is updated in database.");
                            res.send("Driver updated.");
                        });
                }

            });
    } catch (error) {
        return res.send(error);
    }
});

module.exports = router;