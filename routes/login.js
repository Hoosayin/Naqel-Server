const express = require("express");
const cors = require("cors");
const jsonWebToken = require("jsonwebtoken");
const passport = require("../helpers/passportHelper");
const jwtConfiguration = require("../helpers/jwtConfiguration");

const Drivers = require("../models/drivers");
const DriverProfilePhotos = require("../models/driverProfilePhotos");

const Op = require("sequelize").Op;

var router = express.Router();
router.use(cors());

// POST: Login
router.post("/login", (req, res, next) => {
    console.log(req.body.SignInAs);
    passport.authenticate("login", (error, driver, information) => {
        if (error) {
            console.error(`error: ${error}.`);
        }

        if (information) {
            console.error(information.message);
            res.send(information.message);
        }
        else {
            req.logIn(driver, () => {
                Drivers.findOne({
                    where: {
                        [Op.or]: [
                            { Username: req.body.EmailOrUsername },
                            { Email: req.body.EmailOrUsername },
                        ],
                    },
                })
                    .then(driver => {
                        if (driver) {
                            DriverProfilePhotos.findOne({
                                where: { DriverID: driver.dataValues.DriverID }
                            })
                                .then(driverProfilePhoto => {
                                    if (driverProfilePhoto) {
                                        driver.dataValues["DriverProfilePhoto"] = driverProfilePhoto.dataValues;
                                    }
                                    else {
                                        driver.dataValues["DriverProfilePhoto"] = null;
                                    }
                                });


                            let token = jsonWebToken.sign(driver.dataValues, jwtConfiguration.secret);
                            res.send(token);
                        }
                    });
            });     
        }
    })(req, res, next);
});

module.exports = router;


