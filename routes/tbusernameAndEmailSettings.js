const express = require("express");
const cors = require("cors");
const passport = require("../helpers/passportHelper");
const TraderBroker = require("../models/TraderBroker");


var router = express.Router();
router.use(cors());

// POST: usernameAndEmailSettings
router.post("/dashboard/usernameAndEmailSettings", (req, res, next) => {
    try {
        TraderBroker.findOne({
            where: { TraderID: req.body.TraderID },
        })
            .then(driver => {
                if (!driver) {
                    res.send("Driver not found.");
                }
                else {
                    let updatedDriver = {
                        UserName: req.body.UserName,
                        EmailAdrs: req.body.EmailAdrs,
                    }

                    TraderBroker.update(updatedDriver, { where: { TraderID: req.body.TraderID } })
                        .then(() => {
                            console.log("Trader/Broker is updated in database.");
                            res.send("Trader/Broker is updated.");
                        });
                }
            });
    } catch (error) {
        return done(error);
    }
});

module.exports = router;