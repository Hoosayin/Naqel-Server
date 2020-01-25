const express = require("express");
const cors = require("cors");
const Drivers = require("../models/drivers");


var router = express.Router();
router.use(cors());

// POST: validateUsername
router.post("/validateUsername", (req, res) => {
    try {
        Drivers.findOne({
            where: { Username: req.body.Username },
        })
            .then(driver => {
                if (driver) {
                    res.send("Username is not available.");
                }
                else {
                    res.send("Username is available.");
                }
            });
    } catch (error) {
        return res.send(error);
    }
});

module.exports = router;