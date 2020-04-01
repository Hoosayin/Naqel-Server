const express = require("express");
const cors = require("cors");
const Drivers = require("../../../models/drivers");

var router = express.Router();
router.use(cors());

// POST: validateUsername
router.post("/validateUsername", (request, response) => {
    try {
        Drivers.findOne({
            where: { Username: request.body.Username }
        }).then(driver => {
            if (driver) {
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