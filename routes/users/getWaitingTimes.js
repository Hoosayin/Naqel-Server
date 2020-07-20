const express = require("express");
const cors = require("cors");
const WaitingTimes = require("../../models/waitingTimes");

var router = express.Router();
router.use(cors());

// GET: getWaitingTimes
router.get("/getWaitingTimes", (request, response) => {
    try {
        WaitingTimes.findAll().then(waitingTimes => {
            if (waitingTimes) {
                response.json({
                    Message: "Waiting times found.",
                    WaitingTimes: waitingTimes
                });
            }
            else {
                response.json({
                    Message: "Waiting times not found."
                });
            }
        });
    } catch (error) {
        response.json({
            Message: error.message
        });
    }
});

module.exports = router;