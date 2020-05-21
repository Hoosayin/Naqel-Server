const express = require("express");
const cors = require("cors");
const Administrators = require("../../../models/administrators");

var router = express.Router();
router.use(cors());

// POST: validateEmail
router.post("/validateEmail", (request, response) => {
    try {
        Administrators.findOne({
            where: { Email: request.body.Email },
        }).then(administrator => {
            if (administrator) {
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