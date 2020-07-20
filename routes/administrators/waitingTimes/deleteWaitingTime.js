const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const WaitingTimes = require("../../../models/waitingTimes");

var router = express.Router();
router.use(cors());

// POST: deleteWaitingTime
router.delete("/deleteWaitingTime", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                WaitingTimes.findOne({
                    where: { WaitingTimeID: request.body.WaitingTimeID }
                }).then(waitingTime => {
                    if (waitingTime) {
                        waitingTime.destroy();

                        response.json({
                            Message: "Waiting time is deleted."
                        });
                    }
                    else {
                        response.json({
                            Message: "Waiting time not found."
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