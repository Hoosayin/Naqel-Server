const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverObjectionReasons = require("../../../models/driverObjectionReasons");

var router = express.Router();
router.use(cors());

// POST: deleteDriverObjectionReason
router.delete("/deleteDriverObjectionReason", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                DriverObjectionReasons.findOne({
                    where: { DriverObjectionReasonID: request.body.DriverObjectionReasonID }
                }).then(driverObjectionReason => {
                    if (driverObjectionReason) {
                        driverObjectionReason.destroy();

                        response.json({
                            Message: "Objection reason is deleted."
                        });
                    }
                    else {
                        response.json({
                            Message: "Driver objection reason not found."
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