const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
const ExoneratedTraders = require("../../../models/exoneratedTraders");

var router = express.Router();
router.use(cors());

// POST: chargeTrader
router.post("/chargeTrader", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                Traders.findOne({
                    where: { TraderID: request.body.TraderID }
                }).then(trader => {
                    if (trader) {
                        ExoneratedTraders.findOne({
                            where: { TraderID: trader.TraderID }
                        }).then(exoneratedTrader => {
                            if (exoneratedTrader) {
                                exoneratedTrader.destroy();

                                response.json({
                                    Message: "Trader is charged."
                                });
                            }
                            else {
                                response.json({
                                    Message: "Trader is not charged."
                                });
                            }
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