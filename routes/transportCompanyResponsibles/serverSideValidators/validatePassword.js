const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const passport = require("../../../helpers/passportHelper");

var router = express.Router();
router.use(cors());

// POST: validatePassword
router.post("/validatePassword", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, result => {
        try {
            if (result.Message === "Transport company responsible found.") {
                bcrypt.compare(request.body.Password, result.TransportCompanyResponsible.Password).then(matched => {
                    if (!matched) {
                        response.json({
                            Message: "Invalid password."
                        });
                    }
                    else {
                        response.json({
                            Message: "Valid password."
                        });
                    }
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