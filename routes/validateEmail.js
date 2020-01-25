const express = require("express");
const cors = require("cors");
const Drivers = require("../models/drivers");


var router = express.Router();
router.use(cors());

// POST: validateEmail
router.post("/validateEmail", (req, res) => {
    try {
        Drivers.findOne({
            where: { Email: req.body.Email },
        })
            .then(driver => {
                if (driver) {
                    res.send("Email is already taken.");
                }
                else {
                    res.send("Email is available.");
                }
            });
    } catch (error) {
        return res.send(error);
    }
});

module.exports = router;