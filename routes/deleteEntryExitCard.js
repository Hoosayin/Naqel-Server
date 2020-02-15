const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../models/drivers");
const DriverEntryExitCards = require("../models/driverEntryExitCards");
const tokenGenerator = require("../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: deleteEntryExitCard
router.post("/dashboard/deleteEntryExitCard", (req, res) => {
    try {
        let driverToken = jwtDecode(req.body.Token);

        Drivers.findOne({
            where: { DriverID: driverToken.DriverID },
        }).then(driver => {
            if (!driver) {
                res.json({
                    Message: "Driver not found."
                });
            }
            else {
                DriverEntryExitCards.findOne({
                    where: { DriverID: driver.DriverID }
                }).then(driverEntryExitCard => {
                    if (driverEntryExitCard) {
                        driverEntryExitCard.destroy();

                        tokenGenerator.generateDriverToken(driver.DriverID, token => {
                            res.json({
                                Message: "Entry/Exit card is deleted.",
                                Token: token
                            });
                        });                       
                    }
                    else {
                        res.json({
                            Message: "Entry/Exit card not found."
                        });
                    }
                });
            }
        });
    } catch (error) {
        return res.json({
            Message: error
        });
    }
});

module.exports = router;