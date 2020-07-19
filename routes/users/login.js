const express = require("express");
const cors = require("cors");
const uuid = require("uuid-v4");
const jsonWebToken = require("jsonwebtoken");
const jwtConfiguration = require("../../helpers/jwtConfiguration");
const passport = require("../../helpers/passportHelper");
const Drivers = require("../../models/drivers");

var router = express.Router();
router.use(cors());

// POST: Login
router.post("/login", (request, response) => {
    passport.authenticate("Login", result => {
        try {
            if (result.Message === "User found.") {
                const userType = result.UserType;

                if (userType === "Driver") {
                    let tokenID = uuid().substring(0, 8).toUpperCase();

                    let updatedDriver = {
                        TokenID: tokenID
                    };

                    Drivers.update(updatedDriver, { where: { DriverID: result.Driver.DriverID } }).then(() => {
                        let JsonPayload = {
                            DriverID: result.Driver.DriverID,
                            TokenID: tokenID
                        };

                        let token = jsonWebToken.sign(JsonPayload, jwtConfiguration.secret);

                        response.json({
                            Message: "Login successful.",
                            LoggedInAs: "Driver",
                            Token: token
                        });
                    });
                } else if (userType === "Trader") {
                    let JsonPayload = {
                        TraderID: result.Trader.TraderID
                    };

                    let token = jsonWebToken.sign(JsonPayload, jwtConfiguration.secret);
                    response.json({
                        Message: "Login successful.",
                        LoggedInAs: "Trader",
                        Token: token
                    });
                } else {
                    let JsonPayload = {
                        TransportCompanyResponsibleID: result.TCResponsible.TransportCompanyResponsibleID
                    };

                    let token = jsonWebToken.sign(JsonPayload, jwtConfiguration.secret);

                    response.json({
                        Message: "Login successful.",
                        LoggedInAs: "TC Responsible",
                        Token: token
                    });
                }
            }
            else {
                response.json({
                    Message: result.Message
                });
            }
        } catch (error) {
            response.json({
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;


