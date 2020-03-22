const express = require("express");
const cors = require("cors");
const Traders = require("../../../models/traders");

var router = express.Router();
router.use(cors());

// POST: validateEmail
router.post("/validateEmail", (request, response) => {
    try {
        Traders.findOne({
            where: { Email: request.body.Email },
        }).then(trader => {
            if (trader) {
                response.json({
                    Message: "Email is already taken."
                });
            }
            else {
                response.json({
                    Message: "Email is available."
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