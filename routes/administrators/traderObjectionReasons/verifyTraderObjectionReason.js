const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderObjectionReasons = require("../../../models/traderObjectionReasons");

var router = express.Router();
router.use(cors());

// POST: verifyTraderObjectionReason
router.post("/verifyTraderObjectionReason", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TraderObjectionReasons.findOne({
                    where: { DriverObjectionReasonID: request.body.DriverObjectionReasonID }
                }).then(traderObjectionReason => {
                    if (traderObjectionReason) {
                        let updatedTraderObjectionReason = {
                            TraderID: null
                        };

                        TraderObjectionReasons.update(updatedTraderObjectionReason, { where: { DriverObjectionReasonID: traderObjectionReason.DriverObjectionReasonID } }).then(() => {
                            response.json({
                                Message: "Objection reason is verified."
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Trader objection reason not found."
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