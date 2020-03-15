const express = require("express");
const cors = require("cors");
const Traders = require("../../../models/traders");

var router = express.Router();
router.use(cors());

// POST: accountSetup
router.post("/generalSettings", (req, res) => {
    try {
        Traders.findOne({
            where: { TraderID: req.body.TraderID },
        }).then(trader => {
            if (!trader) {
                return done(null, false, { message: "Username not found." });
            }
            else {
                console.log(trader);

                let updatedTrader = {
                    FirstName: req.body.FirstName,
                    LastName: req.body.LastName,
                    Address: req.body.Address,
                    PhoneNumber: req.body.PhoneNumber,
                    Gender: req.body.Gender,
                    Nationality: req.body.Nationality,
                    DateOfBirth: req.body.DateOfBirth,
                }

                Traders.update(updatedTrader, { where: { TraderID: req.body.TraderID } }).then(() => {
                    console.log("Trader/Broker is updated in database.");
                    res.send("Trader/Broker updated.");
                });
            }
        });
    } catch (error) {
        return done(error);
    }
});

module.exports = router;