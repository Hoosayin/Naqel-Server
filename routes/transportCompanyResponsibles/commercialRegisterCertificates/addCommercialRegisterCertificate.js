const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const ResponsibleCommercialRegisterCertificates = require("../../../models/responsibleCommercialRegisterCertificates");

var router = express.Router();
router.use(cors());

// POST: addCommercialRegisterCertificate
router.post("/addCommercialRegisterCertificate", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, result => {
        try {
            if (result.Message === "Transport company responsible found.") {
                ResponsibleCommercialRegisterCertificates.findOne({
                    where: { TransportCompanyResponsibleID: result.TransportCompanyResponsible.TransportCompanyResponsibleID }
                }).then(commercialRegisterCertificate => {
                    if (commercialRegisterCertificate) {
                        response.json({
                            Message: "Commercial register certificate already exists."
                        });
                    }
                    else {
                        let newCommercialRegisterCertificate = {
                            TransportCompanyResponsibleID: result.TransportCompanyResponsible.TransportCompanyResponsibleID,
                            Number: result.TransportCompanyResponsible.CommercialRegisterNumber,
                            Type: request.body.Type,
                            PhotoURL: request.body.PhotoURL
                        };

                        ResponsibleCommercialRegisterCertificates.create(newCommercialRegisterCertificate).then(commercialRegisterCertificate => {
                            response.json({
                                Message: "Commercial register certificate is added.",
                                CommercialRegisterCertificate: commercialRegisterCertificate
                            });
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