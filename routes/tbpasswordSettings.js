const express = require("express");
const cors = require("cors");
const passport = require("../helpers/passportHelper");
const TraderBroker = require("../models/TraderBroker");
const bcrypt = require("bcrypt");

const BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();
router.use(cors());

// POST: passwordSettings
router.post("/dashboard/tbpasswordSettings", (req, res, next) => {
    try {
        TraderBroker.findOne({
            where: { TraderID: req.body.TraderID },
        })
            .then(driver => {
                if (!driver) {
                    res.send("Trader not found.");
                }
                else {
                    bcrypt.hash(req.body.Password, BCRYPT_SALT_ROUNDS)
                        .then(passwordHash => {
                            let updatedDriver = {
                                Password: passwordHash,
                            }

                            TraderBroker.update(updatedDriver, { where: { TraderID: req.body.TraderID } })
                                .then(() => {
                                    console.log("Trader/Broker is updated in database.");
                                    res.send("Trader/Broker is updated.");
                                });
                        });
                }
            });
    } catch (error) {
        return done(error);
    }
});

module.exports = router;