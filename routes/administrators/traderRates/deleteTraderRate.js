const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderRates = require("../../../models/traderRates");

var router = express.Router();
router.use(cors());

// POST: deleteTraderRate
router.delete("/deleteTraderRate", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TraderRates.findOne({
                    where: { TraderRateID: request.body.TraderRateID }
                }).then(traderRate => {
                    if (traderRate) {
                        traderRate.destroy();

                        response.json({
                            Message: "Trader rate is deleted."
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