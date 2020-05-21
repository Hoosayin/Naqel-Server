const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Administrators = require("../../../../models/administrators");
const passport = require("../../../../helpers/passportHelper");

const BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();
router.use(cors());

// POST: passwordSettings
router.post("/passwordSettings", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                bcrypt.hash(request.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                    let updatedAdministrator = {
                        Password: passwordHash,
                    };

                    Administrators.update(updatedAdministrator, { where: { AdministratorID: result.Administrator.AdministratorID } }).then(() => {
                        response.json({
                            Message: "Administrator is updated."
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