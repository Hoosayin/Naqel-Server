const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const ResponsibleCommercialRegisterCertificates = require("../../../models/responsibleCommercialRegisterCertificates");

var router = express.Router();
router.use(cors());

// POST: deleteCommercialRegisterCertificate
router.delete("/deleteCommercialRegisterCertificate", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, (result) => {
        try {
            if (result.Message === "Transport company responsible found.") {
                ResponsibleCommercialRegisterCertificates.findOne({
                    where: { TransportCompanyResponsibleID: result.TransportCompanyResponsible.TransportCompanyResponsibleID }
                }).then(commercialRegisterCertificate => {
                    if (commercialRegisterCertificate) {
                        commercialRegisterCertificate.destroy();

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