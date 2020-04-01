const express = require("express");
const cors = require("cors");
const Drivers = require("../../../models/drivers");

var router = express.Router();
router.use(cors());

// POST: validateEmail
router.post("/validateEmail", (request, response) => {
    try {
        Drivers.findOne({
            where: { Email: request.body.Email },
        }).then(driver => {
            if (driver) {
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