const express = require("express");
const cors = require("cors");
const jsonWebToken = require("jsonwebtoken");
const passport = require("../../../helpers/passportHelper");
const codeGenerator = require("../../../helpers/codeGenerator");
const emailHelper = require("../../../helpers/emailHelper");
const jwtConfiguration = require("../../../helpers/jwtConfiguration");

var router = express.Router();
router.use(cors());

// POST: Register
router.post("/register", (request, response) => {
    passport.authenticate("RegisterTransportCompanyResponsible", result => {
        try {
            if (result.Message === "Credentials are verified.") {
                const code = codeGenerator(6);

                const to = request.body.Email;
                const subject = "Confirmation Code";
                const message = `Your confirmation code is ${code}`;

                emailHelper.sendEmail(to, subject, message, () => {
                    const newCredentails = {
                        Username: request.body.Username,
                        Email: request.body.Email,
                        Password: request.body.Password,
                        RegisterAs: request.body.RegisterAs,
                        Code: code
                    };

                    let token = jsonWebToken.sign(newCredentails, jwtConfiguration.secret);

                    response.json({
                        Message: "Token received.",
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