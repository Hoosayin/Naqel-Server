const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../../../models/drivers");
const DriverIdentityCards = require("../../../models/driverIdentityCards");
const tokenGenerator = require("../../../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: deleteIdentityCard
router.post("/deleteIdentityCard", (req, res) => {
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
                        driverIdentityCard.destroy();

                        tokenGenerator.generateDriverToken(driver.DriverID, token => {
                            res.json({
                                Message: "Identity card is deleted.",
                                Token: token
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