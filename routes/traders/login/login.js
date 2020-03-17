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
    passport.authenticate("loginTrader", (error, trader, information) => {
        if (error) {
            console.error(`error: ${error}.`);
        }

        if (information) {
            console.error(information.message);
            res.send(information.message);
        }
        else {
            req.logIn(trader, () => {
                Traders.findOne({
                    where: {
                        [Op.or]: [
                            { Username: req.body.EmailOrUsername },
                            { Email: req.body.EmailOrUsername },
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