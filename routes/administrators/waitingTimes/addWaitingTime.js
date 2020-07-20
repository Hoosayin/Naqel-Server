const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const WaitingTimes = require("../../../models/waitingTimes");

var router = express.Router();
router.use(cors());

// POST: addWaitingTime
router.post("/addWaitingTime", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let newWaitingTime = { 
                    WaitingTime: request.body.WaitingTime
                };

                WaitingTimes.create(newWaitingTime).then(() => {
                    response.json({
                        Message: "Waiting time is added."
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