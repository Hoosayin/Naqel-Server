const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderRates = require("../../../models/traderRates");

var router = express.Router();
router.use(cors());

// POST: updateTraderRate
router.post("/updateTraderRate", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TraderRates.findOne({
                    where: { TraderRateID: request.body.TraderRateID }
                }).then(traderRate => {
                    if (traderRate) {
                        let updatedTraderRate = {
                            FeeRate: request.body.FeeRate
                        };

                        TraderRates.update(updatedTraderRate, { where: { TraderRateID: traderRate.TraderRateID } }).then(() => {
                            response.json({
                                Message: "Trader rate is updated."
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Trader rate not found."
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