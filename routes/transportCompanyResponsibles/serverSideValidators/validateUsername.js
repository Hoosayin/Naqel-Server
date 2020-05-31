const express = require("express");
const cors = require("cors");
const TransportCompanyResponsibles = require("../../../models/transportCompanyResponsibles");

var router = express.Router();
router.use(cors());

// POST: validateUsername
router.post("/validateUsername", (request, response) => {
    try {
        TransportCompanyResponsibles.findOne({
            where: { Username: request.body.Username }
        }).then(transportCompanyResponsible => {
            if (transportCompanyResponsible) {
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