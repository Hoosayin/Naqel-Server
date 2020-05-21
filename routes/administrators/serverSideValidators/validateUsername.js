const express = require("express");
const cors = require("cors");
const Administrators = require("../../../models/administrators");

var router = express.Router();
router.use(cors());

// POST: validateUsername
router.post("/validateUsername", (request, response) => {
    try {
        Administrators.findOne({
            where: { Username: request.body.Username }
        }).then(administrator => {
            if (administrator) {
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