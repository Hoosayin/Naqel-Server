const express = require("express");
const cors = require("cors");
const TransportCompanyResponsibles = require("../../../models/transportCompanyResponsibles");

var router = express.Router();
router.use(cors());

// POST: validateEmail
router.post("/validateEmail", (request, response) => {
    try {
        TransportCompanyResponsibles.findOne({
            where: { Email: request.body.Email },
        }).then(transportCompanyResponsible => {
            if (transportCompanyResponsible) {
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