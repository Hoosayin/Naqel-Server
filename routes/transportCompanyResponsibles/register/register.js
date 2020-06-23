const express = require("express");
const cors = require("cors");
const jsonWebToken = require("jsonwebtoken");
const passport = require("../../../helpers/passportHelper");
const jwtConfiguration = require("../../../helpers/jwtConfiguration");

var router = express.Router();
router.use(cors());

// POST: Register
router.post("/register", (request, response) => {
    passport.authenticate("RegisterTransportCompanyResponsible", result => {
        try {
            if (result.Message === "Credentials are verified.") {
                const newCredentails = {
                    Username: request.body.Username,
                    PhoneNumber: request.body.PhoneNumber,
                    Password: request.body.Password,
                    RegisterAs: request.body.RegisterAs,
                    Code: code
                };

                let token = jsonWebToken.sign(newCredentails, jwtConfiguration.secret);

                response.json({
                    Message: "Token received.",
                    Token: token
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