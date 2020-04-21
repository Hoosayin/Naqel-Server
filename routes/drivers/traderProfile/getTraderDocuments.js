const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
const TraderIdentityCards = require("../../../models/traderIdentityCards");
const TraderCommercialRegisterCertificates = require("../../../models/traderCommercialRegisterCertificates");
var router = express.Router();
router.use(cors());

// GET: getTraderDocuments
router.get("/getTraderDocuments", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                Traders.findOne({
                    where: { TraderID: request.query.TraderID }
                }).then(async trader => {
                    if (trader) {
                        const traderIdentityCard = await TraderIdentityCards.findOne({
                            where: { TraderID: trader.TraderID }
                        });

                        const traderCommercialRegisterCertificate = await TraderCommercialRegisterCertificates.findOne({
                            where: { TraderID: trader.TraderID }
                        });

                        let traderDocuments = {};

                        if (!traderIdentityCard &&
                            !traderCommercialRegisterCertificate) {
                            traderDocuments = null;
                        }
                        else {
                            traderDocuments = {
                                IdentityCard: traderIdentityCard,
                                CommercialRegisterCertificate: traderCommercialRegisterCertificate
                            };
                        }

                        response.json({
                            Message: "Trader documents found.",
                            TraderDocuments: traderDocuments
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
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;