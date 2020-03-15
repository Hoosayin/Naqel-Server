const express = require("express");
const cors = require("cors");
const jsonWebToken = require("jsonwebtoken");
const passport = require("../../../helpers/passportHelper");
const jwtConfiguration = require("../../../helpers/jwtConfiguration");
const Traders = require("../../../models/traders");
const Op = require("sequelize").Op;

var router = express.Router();
router.use(cors());

// POST: Login
router.post("/login", (req, res, next) => {
    console.log(req.body.SignInAs);
    passport.authenticate("traderLogin", (error, driver, information) => {
        if (error) {
            console.error(`error: ${error}.`);
        }

        if (information) {
            console.error(information.message);
            res.send(information.message);
        }
        else {
            req.logIn(driver, () => {
                Traders.findOne({
                    where: {
                        [Op.or]: [
                            { UserName: req.body.EmailOrUsername },
                            { EmailAdrs: req.body.EmailOrUsername },
                        ],
                    },
                }).then(trader => {
                    if (trader) {
                        let token = jsonWebToken.sign(trader.dataValues, jwtConfiguration.secret);
                        res.send(token);
                    }
                });
            });
        }
    })(req, res, next);
});

module.exports = router;