const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderObjectionReasons = require("../../../models/traderObjectionReasons");

var router = express.Router();
router.use(cors());

// GET: getTraderObjectionReasons
router.get("/getTraderObjectionReasons", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TraderObjectionReasons.findAll().then(traderObjectionReasons => {
                    if (traderObjectionReasons) {
                        response.json({
                            Message: "Trader objection reasons found.",
                            ObjectionReasons: traderObjectionReasons
                        });
                    }
                    else {
                        response.json({
                            Message: "Trader objection reasons not found."
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