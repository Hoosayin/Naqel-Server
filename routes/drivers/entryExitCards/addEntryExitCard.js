const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../../../models/drivers");
const DriverEntryExitCards = require("../../../models/driverEntryExitCards");
const tokenGenerator = require("../../../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: addEntryExitCard
router.post("/addEntryExitCard", (req, res) => {
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
                        res.json({
                            Message: "Entry/Exit card already exists."
                        });
                    }
                    else {
                        let newEntryExitCard = {
                            DriverID: driver.DriverID,
                            EntryExitNumber: req.body.EntryExitNumber,
                            Type: req.body.Type,
                            ReleaseDate: req.body.ReleaseDate,
                            NumberOfMonths: req.body.NumberOfMonths,
                        };

                        DriverEntryExitCards.create(newEntryExitCard).then(() => {
                            tokenGenerator.generateDriverToken(driver.DriverID, token => {
                                res.json({
                                    Message: "Entry/Exit card is added.",
                                    Token: token
                                });
                            });
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