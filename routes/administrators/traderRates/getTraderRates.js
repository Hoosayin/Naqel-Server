const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderRates = require("../../../models/traderRates");
const Traders = require("../../../models/traders");

var router = express.Router();
router.use(cors());

// GET: getTraderRates
router.get("/getTraderRates", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TraderRates.findAll().then(async traderRates => {
                    if (traderRates) {
                        let modifiableTraderRates = [];
                        let count = 0;

                        for (let traderRate of traderRates) {
                            const trader = await Traders.findOne({
                                attributes: ["Username"],
                                where: { TraderID: traderRate.TraderID }
                            });

                            let modifiableTraderRate = traderRate.dataValues;
                            modifiableTraderRate.Username = trader.Username;

                            modifiableTraderRates[count++] = modifiableTraderRate;
                        }

                        response.json({
                            Message: "Trader rates found.",
                            TraderRates: modifiableTraderRates
                        });
                    }
                    else {
                        response.json({
                            Message: "Trader rates not found."
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