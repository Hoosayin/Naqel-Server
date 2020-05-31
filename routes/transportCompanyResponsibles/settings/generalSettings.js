const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TransportCompanyResponsibles = require("../../../models/transportCompanyResponsibles");

var router = express.Router();
router.use(cors());

// POST: generalSettings
router.post("/generalSettings", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, result => {
        try {
            if (result.Message === "Transport company responsible found.") {
                let updatedTransportCompanyResponsible = {
                    Name: request.body.Name,
                    PhoneNumber: request.body.PhoneNumber
                };

                TransportCompanyResponsibles.update(updatedTransportCompanyResponsible, { where: { TransportCompanyResponsibleID: result.TransportCompanyResponsible.TransportCompanyResponsibleID } }).then(() => {
                    response.json({
                        Message: "Transport company responsible is updated."
                    });
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