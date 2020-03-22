const express = require("express");
const cors = require("cors");
const Traders = require("../../../models/traders");

var router = express.Router();
router.use(cors());

// POST: validateUsername
router.post("/validateUsername", (request, response) => {
    try {
        Traders.findOne({
            where: { Username: request.body.Username }
        }).then(trader => {
            if (trader) {
                response.json({
                    Message: "Username is unavailable."
                });
            }
            else {
                response.json({
                    Message: "Username is available."
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