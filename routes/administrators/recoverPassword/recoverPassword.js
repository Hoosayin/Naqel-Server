const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Administrators = require("../../../models/administrators");

const BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();
router.use(cors());

// POST: recoverPassword
router.post("/recoverPassword", (request, response) => {
    Administrators.findOne({
        where: { PhoneNumber: request.body.PhoneNumber }
    }).then(administrator => {
        if (administrator) {
            bcrypt.hash(request.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                let updatedAdministrator = {
                    Password: passwordHash,
                };

                Administrators.update(updatedAdministrator, { where: { AdministratorID: administrator.AdministratorID } }).then(() => {
                    response.json({
                        Message: "Password is updated."
                    });
                });
            });
        }
        else {
            response.json({
                Message: "Administrator not found."
            });
        }
    }).catch(error => {
        response.json({
            Message: error.message
        })
    });
});

module.exports = router;