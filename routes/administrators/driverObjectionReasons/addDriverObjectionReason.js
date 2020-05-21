const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverObjectionReasons = require("../../../models/driverObjectionReasons");

var router = express.Router();
router.use(cors());

// POST: addDriverObjectionReason
router.post("/addDriverObjectionReason", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let newDriverObjectionReason = {
                    DriverID: null, 
                    Reason: request.body.Reason
                };

                DriverObjectionReasons.create(newDriverObjectionReason).then(() => {
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