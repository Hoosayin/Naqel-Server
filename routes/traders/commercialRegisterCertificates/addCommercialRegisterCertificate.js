const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderCommercialRegisterCertificates = require("../../../models/traderCommercialRegisterCertificates");

var router = express.Router();
router.use(cors());

// POST: addCommercialRegisterCertificate
router.post("/addCommercialRegisterCertificate", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                TraderCommercialRegisterCertificates.findOne({
                    where: { TraderID: result.Trader.TraderID }
                }).then(traderCommercialRegisterCertificate => {
                    if (traderCommercialRegisterCertificate) {
                        res.json({
                            Message: "Commercial register certificate already exists."
                        });
                    }
                    else {
                        let newCommercialRegisterCertificate = {
                            TraderID: result.Trader.TraderID,
                            Number: request.body.Number,
                            Type: request.body.Type,
                            PhotoURL: request.body.PhotoURL
                        };

                        TraderCommercialRegisterCertificates.create(newCommercialRegisterCertificate).then(() => {
                            response.json({
                                Message: "Commercial register certificate is added."
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
                Message: error.Message,
            });
        }
    })(request, response);
});

module.exports = router;