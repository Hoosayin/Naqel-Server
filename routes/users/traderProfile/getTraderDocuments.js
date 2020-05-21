const express = require("express");
const cors = require("cors");
const Traders = require("../../../models/traders");
const TraderIdentityCards = require("../../../models/traderIdentityCards");
const TraderCommercialRegisterCertificates = require("../../../models/traderCommercialRegisterCertificates");
var router = express.Router();
router.use(cors());

// GET: getTraderDocuments
router.get("/getTraderDocuments", (request, response) => {
    try {
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
    } catch (error) {
        response.json({
            Message: error.message
        });
    }
});

module.exports = router;