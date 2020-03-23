const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderCommercialRegisterCertificates = require("../../../models/traderCommercialRegisterCertificates");

var router = express.Router();
router.use(cors());

// POST: deleteCommercialRegisterCertificate
router.delete("/deleteCommercialRegisterCertificate", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                TraderCommercialRegisterCertificates.findOne({
                    where: { TraderID: result.Trader.TraderID }
                }).then(traderCommercialRegisterCertificate => {
                    if (traderCommercialRegisterCertificate) {
                        traderCommercialRegisterCertificate.destroy();

                        response.json({
                            Message: "Commercial register certificate is deleted."
                        });
                    }
                    else {
                        response.json({
                            Message: "Commercial register certificate not found."
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