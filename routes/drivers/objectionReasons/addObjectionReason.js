const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverObjectionReasons = require("../../../models/driverObjectionReasons");

var router = express.Router();
router.use(cors());

// POST: addObjectionReason
router.post("/addObjectionReason", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                let newObjectionReason = {
                    DriverID: result.Driver.DriverID,
                    Reason: request.body.Reason
                };

                DriverObjectionReasons.create(newObjectionReason).then(objectionReason => {
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