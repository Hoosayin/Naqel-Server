const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const ResponsibleCommercialRegisterCertificates = require("../../../models/responsibleCommercialRegisterCertificates");

var router = express.Router();
router.use(cors());

// GET: getCommercialRegisterCertificate
router.get("/getCommercialRegisterCertificate", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, (result) => {
        try {
            if (result.Message === "Transport company responsible found.") {
                ResponsibleCommercialRegisterCertificates.findOne({
                    where: { TransportCompanyResponsibleID: result.TransportCompanyResponsible.TransportCompanyResponsibleID }
                }).then(commercialRegisterCertificate => {
                    if (commercialRegisterCertificate) {
                        response.json({
                            Message: "Commercial register certificate found.",
                            CommercialRegisterCertificate: commercialRegisterCertificate
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
                Message: error.Message ,
            });
        }
    })(request, response);
});

module.exports = router;