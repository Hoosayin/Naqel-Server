const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderIdentityCards = require("../../../models/traderIdentityCards");

var router = express.Router();
router.use(cors());

// GET: getProfilePhoto
router.get("/getIdentityCard", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                TraderIdentityCards.findOne({
                    where: { TraderID: result.Trader.TraderID }
                }).then(traderIdentityCard => {
                    if (traderIdentityCard) {
                        response.json({
                            Message: "Identity card found.",
                            IdentityCard: traderIdentityCard
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
                Message: result.Message ,
            });
        }
    })(request, response);
});

module.exports = router;