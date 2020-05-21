const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderObjectionReasons = require("../../../models/traderObjectionReasons");

var router = express.Router();
router.use(cors());

// POST: addTraderObjectionReason
router.post("/addTraderObjectionReason", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let newTraderObjectionReason = {
                    TraderID: null, 
                    Reason: request.body.Reason
                };

                TraderObjectionReasons.create(newTraderObjectionReason).then(() => {
                    response.json({
                        Message: "Objection reason is added."
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
                Message: error.message,
            });
        }
    })(request, response);
});

module.exports = router;