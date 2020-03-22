const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");

var router = express.Router();
router.use(cors());

// POST: usernameAndEmailSettings
router.post("/usernameAndEmailSettings", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                let updatedTrader = {
                    Username: request.body.Username,
                    Email: request.body.Email,
                }

                Traders.update(updatedTrader, { where: { TraderID: result.Trader.TraderID } }).then(() => {
                    response.json({
                        Message: "Trader is updated."
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
                Message: error.Message,
            });
        }
    })(request, response);
});

module.exports = router;