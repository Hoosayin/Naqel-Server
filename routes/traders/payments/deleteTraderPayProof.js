const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderIdentityCards = require("../../../models/traderIdentityCards");
const TraderPayProofs = require("../../../models/traderPayProofs");

var router = express.Router();
router.use(cors());

// POST: deleteTraderPayProof
router.delete("/deleteTraderPayProof", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                TraderPayProofs.findOne({
                    where: { TraderPayProofID: request.body.TraderPayProofID }
                }).then(traderPayProof => {
                    if (traderPayProof) {
                        if (traderPayProof.Approved) {
                            response.json({
                                Message: "Cannot delete approved trader pay proof."
                            });
                        }
                        else {
                            traderPayProof.destroy();

                            response.json({
                                Message: "Trader pay proof is deleted."
                            });
                        }
                    }
                    else {
                        response.json({
                            Message: "Trader pay proof not found."
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