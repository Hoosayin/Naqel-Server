const express = require("express");
const cors = require("cors");
const passport = require("../../../../helpers/passportHelper");
const AdminSecretHelper = require("../../../../helpers/adminSecretHelper");

var router = express.Router();
router.use(cors());

// GET: updateAdminSecret
router.post("/updateAdminSecret", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                AdminSecretHelper.SetAdminSecret(request.body.AdminSecret);

                response.json({
                    Message: "Admin secret is updated."
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