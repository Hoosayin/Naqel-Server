const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderCommercialRegisterCertificates = require("../../../models/traderCommercialRegisterCertificates");

var router = express.Router();
router.use(cors());

// POST: updateCommercialRegisterCertificate
router.post("/updateCommercialRegisterCertificate", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                TraderCommercialRegisterCertificates.findOne({
                    where: { TraderID: result.Trader.TraderID }
                }).then(traderCommercialRegisterCertificate => {
                    if (traderCommercialRegisterCertificate) {
                        let updatedCommercialRegisterCertificate = {
                            Number: request.body.Number,
                            Type: request.body.Type,
                            PhotoURL: request.body.PhotoURL
                        };

                        TraderCommercialRegisterCertificates.update(updatedCommercialRegisterCertificate, { where: { ID: traderCommercialRegisterCertificate.ID } }).then(() => {
                            response.json({
                                Message: "Commercial register certificate is updated."
                            });
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