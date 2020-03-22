const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");

const BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();
router.use(cors());

// POST: passwordSettings
router.post("/passwordSettings", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                bcrypt.hash(request.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                    let updatedTrader = {
                        Password: passwordHash,
                    };

                    Traders.update(updatedTrader, { where: { TraderID: result.Trader.TraderID } }).then(() => {
                        response.json({
                            Message: "Trader is updated."
                        });
                    });
                });
            }
            else {
                response.json({
                    Message: "Trader not found."
                });
            }
        } catch (error) {
            response.json({
                Message: result.Message,
            });
        }
    })(request, response);
});

module.exports = router;