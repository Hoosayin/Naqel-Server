const express = require("express");
const cors = require("cors");
const passport = require("../../../../helpers/passportHelper");
const AdminSecretHelper = require("../../../../helpers/adminSecretHelper");

var router = express.Router();
router.use(cors());

// GET: getAdminSecret
router.get("/getAdminSecret", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                AdminSecretHelper.GetAdminSecret(secret => {
                    if (secret) {
                        response.json({
                            Message: "Admin secret found.",
                            AdminSecret: secret
                        });
                    }
                    else {
                        response.json({
                            Message: "Admin secret not found."
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