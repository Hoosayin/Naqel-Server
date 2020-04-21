const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderObjectionReasons = require("../../../models/traderObjectionReasons");

var router = express.Router();
router.use(cors());

// POST: addObjectionReason
router.post("/addObjectionReason", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                let newObjectionReason = {
                    TraderID: result.Trader.TraderID,
                    Reason: request.body.Reason
                };

                TraderObjectionReasons.create(newObjectionReason).then(objectionReason => {
                    response.json({
                        Message: "Objection reason is added.",
                        ObjectionReason: objectionReason
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