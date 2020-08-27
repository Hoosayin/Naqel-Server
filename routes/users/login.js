const express = require("express");
const cors = require("cors");
const jsonWebToken = require("jsonwebtoken");
const jwtConfiguration = require("../../helpers/jwtConfiguration");
const passport = require("../../helpers/passportHelper");
const Drivers = require("../../models/drivers");
const Traders = require("../../models/traders");
const Responsibles = require("../../models/transportCompanyResponsibles");

var router = express.Router();
router.use(cors());

// POST: Login
router.post("/login", (request, response) => {
    passport.authenticate("Login", result => {
        try {
            if (result.Message === "User found.") {
                const userType = result.UserType;

                if (userType === "Driver") {
                    const driver = result.Driver;

                    Drivers.update({
                        Online: true
                    }, {
                        where: { DriverID: driver.DriverID }
                    }).then(() => {
                        response.json({
                            Message: "Login successful.",
                            LoggedInAs: "Driver",
                            Token: jsonWebToken.sign({
                                DriverID: driver.DriverID,
                            }, jwtConfiguration.secret)
                        });
                    });
                } else if (userType === "Trader") {
                    const trader = result.Trader;

                    Traders.update({
                        Online: true
                    }, {
                        where: { TraderID: trader.TraderID }
                    }).then(() => {
                        response.json({
                            Message: "Login successful.",
                            LoggedInAs: "Trader",
                            Token: jsonWebToken.sign({
                                TraderID: trader.TraderID
                            }, jwtConfiguration.secret)
                        });
                    });                    
                } else {
                    const responsible = result.TCResponsible;

                    Responsibles.update({
                        Online: true
                    }, {
                        where: { TransportCompanyResponsibleID: responsible.TransportCompanyResponsibleID }
                    }).then(() => {
                        response.json({
                            Message: "Login successful.",
                            LoggedInAs: "TC Responsible",
                            Token: jsonWebToken.sign({
                                TransportCompanyResponsibleID: responsible.TransportCompanyResponsibleID
                            }, jwtConfiguration.secret)
                        });
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


