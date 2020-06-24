const express = require("express");
const cors = require("cors");
const Traders = require("../../../models/traders");

var router = express.Router();
router.use(cors());

// POST: validatePassword
router.post("/validatePhoneNumber", (request, response) => {
    Traders.findOne({
        where: { PhoneNumber: request.body.PhoneNumber }
    }).then(trader => {
        if (trader) {
            response.json({
                Message: "Phone number is already used."
            });
        }
        else {
            response.json({
                Message: "Valid phone number."
            });
        }
    }).catch(error => {
        response.json({
            Message: error.message
        });
    });
});

module.exports = router;