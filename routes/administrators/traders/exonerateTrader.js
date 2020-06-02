const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
const ExoneratedTraders = require("../../../models/exoneratedTraders");

var router = express.Router();
router.use(cors());

// POST: exonerateTrader
router.post("/exonerateTrader", (request, response) => {
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
                                response.json({
                                    Message: "Trader is already exonerated."
                                });
                            }
                            else {
                                let newExoneratedTrader = {
                                    TraderID: trader.TraderID,
                                    AdministratorID: result.Administrator.AdministratorID,
                                    ExonerateDate: request.body.ExonerateDate,
                                    Reason: request.body.Reason,
                                    Created: new Date()
                                };

                                ExoneratedTraders.create(newExoneratedTrader).then(() => {
                                    response.json({
                                        Message: "Trader is exonerated."
                                    });
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