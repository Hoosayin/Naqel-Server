const express = require("express");
const cors = require("cors");
const jsonWebToken = require("jsonwebtoken");
const passport = require("../helpers/passportHelper");
const jwtConfiguration = require("../helpers/jwtConfiguration");
const TraderBroker = require("../models/TraderBroker");
const Op = require("sequelize").Op;

var router = express.Router();
router.use(cors());

// POST: Login
router.post("/traderbrokerlogin", (req, res, next) => {
    console.log(req.body.SignInAs);
    passport.authenticate("traderlogin", (error, driver, information) => {
        if (error) {
            console.error(`error: ${error}.`);
        }

        if (information) {
            console.error(information.message);
            res.send(information.message);
        }
        else {
            req.logIn(driver, () => {
                TraderBroker.findOne({
                    where: {
                        [Op.or]: [
                            { UserName: req.body.EmailOrUsername },
                            { EmailAdrs: req.body.EmailOrUsername },
                        ],
                    },
                })
                    .then(traderbroker => {
                        if (traderbroker) {
                            let token = jsonWebToken.sign(traderbroker.dataValues, jwtConfiguration.secret);
                            res.send(token);
                        }
                    });
            });
        }
    })(req, res, next);
});

module.exports = router;


