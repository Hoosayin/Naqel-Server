const express = require("express");
const cors = require("cors");
const uuid = require("uuid-v4");
const jsonWebToken = require("jsonwebtoken");
const jwtConfiguration = require("../../../helpers/jwtConfiguration");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");

var router = express.Router();
router.use(cors());

// POST: Login
router.post("/login", (request, response) => {
    passport.authenticate("LoginDriver", result => {
        try {
            if (result.Message === "Driver found.") {
                request.logIn(result.Driver, () => {
                    let tokenID = uuid().substring(0, 8).toUpperCase();

                    let updatedDriver = {
                        TokenID: tokenID
                    };

                    Drivers.update(updatedDriver { where: { DriverID: result.Driver.DriverID } }).then(() => {
                        let JsonPayload = {
                            DriverID: result.Driver.DriverID,
                            TokenID: tokenID
                        };

                        let token = jsonWebToken.sign(JsonPayload, jwtConfiguration.secret);

                        response.json({
                            Message: "Login successful.",
                            Token: token
                        });
                    });
                });
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


