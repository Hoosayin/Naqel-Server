const express = require("express");
const cors = require("cors");
const jsonWebToken = require("jsonwebtoken");
const jwtConfiguration = require("../../../helpers/jwtConfiguration");
const passport = require("../../../helpers/passportHelper");

var router = express.Router();
router.use(cors());

// POST: Login
router.post("/login", (request, response) => {
    passport.authenticate("LoginAdministrator", result => {
        try {
            if (result.Message === "Administrator found.") {
                request.logIn(result.Administrator, () => {
                    let JsonPayload = {
                        AdministratorID: result.Administrator.AdministratorID
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