const express = require("express");
const cors = require("cors");
const TransportCompanyResponsibles = require("../../../models/transportCompanyResponsibles");

var router = express.Router();
router.use(cors());

// POST: validatePassword
router.post("/validatePhoneNumber", (request, response) => {
    TransportCompanyResponsibles.findOne({
        where: { PhoneNumber: request.body.PhoneNumber }
    }).then(responsible => {
        if (responsible) {
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