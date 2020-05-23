const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
const TraderRates = require("../../../models/traderRates");

var router = express.Router();
router.use(cors());

// POST: addTraderRate
router.post("/addTraderRate", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                Traders.findOne({
                    where: { Username: request.body.Username }
                }).then(trader => {
                    if (trader) {
                        let newTraderRate = {
                            TraderID: trader.TraderID,
                            FeeRate: request.body.FeeRate
                        };

                        TraderRates.create(newTraderRate).then(traderRate => {
                            let modifiableTraderRate = traderRate.dataValues;
                            modifiableTraderRate.Username = trader.Username;

                            response.json({
                                Message: "Trader rate is added.",
                                TraderRate: modifiableTraderRate
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Trader not found."
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
                Message: error.message,
            });
        }
    })(request, response);
});

module.exports = router;