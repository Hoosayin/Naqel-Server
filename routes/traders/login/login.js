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
router.post("/login", (request, response) => {
    passport.authenticate("LoginTrader", (error, trader, information) => {
        if (error) {
            console.error(`error: ${error}.`);
        }

        if (information) {
            console.error(information.Message);
            response.json({
                Message: "Login failed."
            });
        }
        else {
            request.logIn(trader, () => {
                if (trader) {
                    let JsonPayload = {
                        TraderID: trader.dataValues.TraderID
                    };

                    let token = jsonWebToken.sign(JsonPayload, jwtConfiguration.secret);
                    response.json({
                        Message: "Login successful.",
                        Token: token
                    });
                }
            });
        }
    })(request, response);
});

module.exports = router;