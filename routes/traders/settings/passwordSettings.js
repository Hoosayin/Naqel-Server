const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Traders = require("../../../models/traders");

const BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();
router.use(cors());

// POST: passwordSettings
router.post("/passwordSettings", (req, res) => {
    try {
        Traders.findOne({
            where: { TraderID: req.body.TraderID },
        }).then(trader => {
            if (!trader) {
                res.send("Trader not found.");
            }
            else {
                bcrypt.hash(req.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                    let updatedTrader = {
                        Password: passwordHash,
                    }

                    Traders.update(updatedTrader, { where: { TraderID: req.body.TraderID } }).then(() => {
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