const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Administrators = require("../../../models/administrators");

var router = express.Router();
router.use(cors());

// POST: uploadProfilePhoto
router.post("/uploadProfilePhoto", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let updatedAdministrator = {
                    PhotoURL: request.body.PhotoURL
                };

                Administrators.update(updatedAdministrator, { where: { AdministratorID: result.Administrator.AdministratorID } }).then(() => {
                    response.json({
                        Message: "Profile photo is updated."
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