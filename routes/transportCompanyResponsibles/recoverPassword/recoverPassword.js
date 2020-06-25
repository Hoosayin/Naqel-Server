const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const TransportCompanyResponsibles = require("../../../models/transportCompanyResponsibles");

const BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();
router.use(cors());

// POST: recoverPassword
router.post("/recoverPassword", (request, response) => {
    TransportCompanyResponsibles.findOne({
        where: { PhoneNumber: request.body.PhoneNumber }
    }).then(responsible => {
        if (responsible) {
            bcrypt.hash(request.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                let updatedResponsible = {
                    Password: passwordHash,
                };

                TransportCompanyResponsibles.update(updatedResponsible, { where: { TransportCompanyResponsibleID: responsible.TransportCompanyResponsibleID } }).then(() => {
                    response.json({
                        Message: "Password is updated."
                    });
                });
            });
        }
        else {
            response.json({
                Message: "Transport company responsible not found."
            });
        }
    }).catch(error => {
        response.json({
            Message: error.message
        });
    });
});

module.exports = router;