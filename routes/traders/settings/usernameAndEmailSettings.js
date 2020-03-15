const express = require("express");
const cors = require("cors");
const TraderBroker = require("../../../models/traders");

var router = express.Router();
router.use(cors());

// POST: usernameAndEmailSettings
router.post("/usernameAndEmailSettings", (req, res) => {
    try {
        Traders.findOne({
            where: { TraderID: req.body.TraderID },
        }).then(trader => {
            if (!trader) {
                res.send("Driver not found.");
            }
            else {
                let updatedTrader = {
                    Username: req.body.Username,
                    Email: req.body.Email,
                }

                TraderBroker.update(updatedTrader, { where: { TraderID: req.body.TraderID } }).then(() => {
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