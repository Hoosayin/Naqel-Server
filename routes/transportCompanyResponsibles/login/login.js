const express = require("express");
const cors = require("cors");
const jsonWebToken = require("jsonwebtoken");
const jwtConfiguration = require("../../../helpers/jwtConfiguration");
const passport = require("../../../helpers/passportHelper");

var router = express.Router();
router.use(cors());

// POST: Login
router.post("/login", (request, response) => {
    passport.authenticate("LoginTransportCompanyResponsible", result => {
        try {
            if (result.Message === "Transport company responsible found.") {
                request.logIn(result.TransportCompanyResponsible, () => {
                    let JsonPayload = {
                        TransportCompanyResponsibleID: result.TransportCompanyResponsible.TransportCompanyResponsibleID
                    };

                    let token = jsonWebToken.sign(JsonPayload, jwtConfiguration.secret);

                    response.json({
                        Message: "Login successful.",
                        Token: token
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