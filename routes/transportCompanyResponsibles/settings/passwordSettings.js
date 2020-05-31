const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const TransportCompanyResponsibles = require("../../../models/transportCompanyResponsibles");
const passport = require("../../../helpers/passportHelper");

const BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();
router.use(cors());

// POST: passwordSettings
router.post("/passwordSettings", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, result => {
        try {
            if (result.Message === "Transport company responsible found.") {
                bcrypt.hash(request.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                    let updatedTransportCompanyResponsible = {
                        Password: passwordHash,
                    };

                    TransportCompanyResponsibles.update(updatedTransportCompanyResponsible, { where: { TransportCompanyResponsibleID: result.TransportCompanyResponsible.TransportCompanyResponsibleID } }).then(() => {
                        response.json({
                            Message: "Transport company responsible is updated."
                        });
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
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;