const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const passport = require("../../../helpers/passportHelper");

var router = express.Router();
router.use(cors());

// POST: validatePassword
router.post("/validatePassword", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                bcrypt.compare(request.body.Password, result.Trader.Password).then(matched => {
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
                    Message: "Trader not found."
                });
            }
        } catch (error) {
            response.json({
                Message: "Trader not found.",
            });
        }
    })(request, response);
});

module.exports = router;