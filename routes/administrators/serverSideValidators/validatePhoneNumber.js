const express = require("express");
const cors = require("cors");
const Administrators = require("../../../models/administrators");

var router = express.Router();
router.use(cors());

// POST: validatePassword
router.post("/validatePhoneNumber", (request, response) => {
    Administrators.findOne({
        where: { PhoneNumber: request.body.PhoneNumber }
    }).then(administrator => {
        if (administrator) {
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