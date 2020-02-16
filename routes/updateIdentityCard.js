const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../models/drivers");
const DriverEntryExitCards = require("../models/driverEntryExitCards");
const DriverIdentityCards = require("../models/driverIdentityCards");
const tokenGenerator = require("../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: updateIdentityCard
router.post("/dashboard/updateIdentityCard", (req, res) => {
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
                DriverIdentityCards.findOne({
                    where: { DriverID: driver.DriverID }
                }).then(driverIdentityCard => {
                    if (driverIdentityCard) {
                        let updatedIdentityCard = {
                            IDNumber: req.body.IDNumber,
                            PhotoURL: req.body.PhotoURL,
                        };

                        DriverIdentityCards.update(updatedIdentityCard, { where: { IdentityCardID: driverIdentityCard.IdentityCardID } }).then(() => {
                            tokenGenerator.generateDriverToken(driver.DriverID, token => {
                                res.json({
                                    Message: "Identity card is updated.",
                                    Token: token
                                });
                            });
                        });
                        
                    }
                    else {
                        res.json({
                            Message: "Identity card not found."
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