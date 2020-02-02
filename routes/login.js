const express = require("express");
const cors = require("cors");
const passport = require("../helpers/passportHelper");
const tokenGenerator = require("../helpers/tokenGenerator");
const Drivers = require("../models/drivers");

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
                }).then(driver => {
                        if (driver) {
                            tokenGenerator.generateDriverToken(driver.dataValues.DriverID, token => {
                                res.send(token);
                            });                         
                        }
                    });
            });     
        }
    })(req, res, next);
});

module.exports = router;


