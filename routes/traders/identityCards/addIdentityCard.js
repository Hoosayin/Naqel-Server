const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderIdentityCards = require("../../../models/traderIdentityCards");


var router = express.Router();
router.use(cors());

// POST: addIdentityCard
router.post("/addIdentityCard", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                TraderIdentityCards.findOne({
                    where: { Trader: result.Trader.DriverID }
                }).then(traderIdentityCard => {
                    if (traderIdentityCard) {
                        res.json({
                            Message: "Identity card already exists."
                        });
                    }
                    else {
                        let newIdentityCard = {
                            TraderID: result.Trader.DriverID,
                            IDNumber: request.body.IDNumber,
                            PhotoURL: request.body.PhotoURL,
                            Created: new Date()
                        };

                        TraderIdentityCards.create(newIdentityCard).then(() => {
                            response.json({
                                Message: "Identity card is added."
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
        } catch (error) {
            response.json({
                Message: result.Message,
            });
        }
    })(request, response);
});

module.exports = router;