const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const codeGenerator = require("../../../helpers/codeGenerator");
const emailHelper = require("../../../helpers/emailHelper");
const jsonWebToken = require("jsonwebtoken");
const jwtConfiguration = require("../../../helpers/jwtConfiguration");

var router = express.Router();
router.use(cors());

// POST: Register
router.post("/register", (req, res, next) => {
    passport.authenticate("RegisterTrader", (error, trader, information) => {
        if (error) {
            console.error(`error: ${error}`);
        }

        if (information) {
            console.error(information.message);
            res.send(information.message);
        }
        else {
            req.logIn(trader, error => {
                console.log(trader);

                const code = codeGenerator(6);

                const to = req.body.Email;
                const subject = "Confirmation Code";
                const message = `Your confirmation code is ${code}`;

                emailHelper.sendEmail(to, subject, message, () => {
                    const newCredentails = {
                        Username: req.body.Username,
                        Email: req.body.Email,
                        Password: req.body.Password,
                        RegisterAs: req.body.RegisterAs,
                        Code: code
                    };

                    let token = jsonWebToken.sign(newCredentails, jwtConfiguration.secret);
                    res.send(token);
                });
            });
                }
    })(req, res, next);
});

module.exports = router;