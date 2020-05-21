const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");
const TraderRefundRates = require("../../../models/traderRefundRates");

var router = express.Router();
router.use(cors());

// GET: getTraders
router.get("/getTraders", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                Traders.findAll({
                    attributes: ["TraderID", "Username", "Email", "FirstName", "LastName", "Type"]
                }).then(async traders => {
                    if(traders) {
                        let modifiableTraders = [];
                        let count = 0;

                        for (let trader of traders) {
                            const traderProfilePhoto = await TraderProfilePhotos.findOne({
                                where: { TraderID: trader.TraderID }
                            });

                            const traderRefundRate = await TraderRefundRates.findOne({
                                where: { TraderID: trader.TraderID }
                            });

                            let modifiableTrader = trader.dataValues;
                            modifiableTrader.PhotoURL = traderProfilePhoto ? traderProfilePhoto.PhotoURL : null;
                            modifiableTrader.TraderRefundRate = traderRefundRate;

                            modifiableTraders[count++] = modifiableTrader;
                        }

                        response.json({
                            Message: "Traders found.",
                            Traders: modifiableTraders
                        });
                    }
                    else {
                        response.json({
                            Message: "Traders not found."
                        });
                    }
                });
            }
            else {
                response.json({
                    Message: result.Message
                });
            }
        } catch (error) {
            response.json({
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;