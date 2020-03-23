const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderIdentityCards = require("../../../models/traderIdentityCards");

var router = express.Router();
router.use(cors());

// POST: deleteIdentityCard
router.delete("/deleteIdentityCard", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                TraderIdentityCards.findOne({
                    where: { TraderID: result.Trader.TraderID }
                }).then(traderIdentityCard => {
                    if (traderIdentityCard) {
                        traderIdentityCard.destroy();

                        response.json({
                            Message: "Identity card is deleted."
                        });
                    }
                    else {
                        response.json({
                            Message: "Identity card not found."
                        });
                    }
                });
            }
            else {
                response.json({
                    Message: "Trader not found."
                });
            }
        } catch (error) {
            response.json({
                Message: error.Message,
            });
        }
    })(request, response);
});

module.exports = router;