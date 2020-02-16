const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../models/drivers");
const DriverIdentityCards = require("../models/driverIdentityCards");
const tokenGenerator = require("../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: addIdentityCard
router.post("/dashboard/addIdentityCard", (req, res) => {
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
                        res.json({
                            Message: "Identity card already exists."
                        });
                    }
                    else {
                        let newIdentityCard = {
                            DriverID: driver.DriverID,
                            IDNumber: req.body.IDNumber,
                            PhotoURL: req.body.PhotoURL,
                            Created: new Date()
                        };

                        DriverIdentityCards.create(newIdentityCard).then(() => {
                            tokenGenerator.generateDriverToken(driver.DriverID, token => {
                                res.json({
                                    Message: "Identity card is added.",
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