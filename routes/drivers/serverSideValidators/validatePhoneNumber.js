const express = require("express");
const cors = require("cors");
const Drivers = require("../../../models/drivers");

var router = express.Router();
router.use(cors());

// POST: validatePassword
router.post("/validatePhoneNumber", (request, response) => {
    Drivers.findOne({
        where: { PhoneNumber: request.body.PhoneNumber }
    }).then(driver => {
        if (driver) {
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