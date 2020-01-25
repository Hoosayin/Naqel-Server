const express = require("express");
const cors = require("cors");
const passport = require("../helpers/passportHelper");
const Drivers = require("../models/drivers");
const jsonWebToken = require("jsonwebtoken");
const jwtConfiguration = require("../helpers/jwtConfiguration");


var router = express.Router();
router.use(cors());

// POST: Register
router.post("/register", (req, res, next) => {
    passport.authenticate("register", (error, driver, information) => {
        if (error) {
            console.error(`error: ${error}`);
        }

        if (information) {
            console.error(information.message);
            res.send(information.message);
        }
        else {
            req.logIn(driver, error => {
                console.log(driver);

                const newCredentails = {
                    Username: req.body.Username,
                    Email: req.body.Email,
                    Password: req.body.Password,
                    RegisterAs: req.body.RegisterAs,
                };

                let token = jsonWebToken.sign(newCredentails, jwtConfiguration.secret);
                res.send(token);
            });
        }
    })(req, res, next);
});

module.exports = router;