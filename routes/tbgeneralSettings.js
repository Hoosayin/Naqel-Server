const express = require("express");
const cors = require("cors");
const passport = require("../helpers/passportHelper");
const TraderBroker = require("../models/TraderBroker");


var router = express.Router();
router.use(cors());

// POST: accountSetup
router.post("/dashboard/tbgeneralSettings", (req, res, next) => {
    try {
        TraderBroker.findOne({
            where: { TraderID: req.body.TraderID },
        })
            .then(driver => {
                if (!driver) {
                    return done(null, false, { message: "Username not found." });
                }
                else {
                    console.log(driver);

                    let updatedDriver = {
                        FName: req.body.FName,
                        LName: req.body.LName,
                        Address: req.body.Address,
                        MobileNum: req.body.MobileNum,
                        Gender: req.body.Gender,
                        Nationality: req.body.Nationality,
                        BirthDate: req.body.BirthDate,
                    }

                    TraderBroker.update(updatedDriver, { where: { TraderID: req.body.TraderID } })
                        .then(() => {
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