const express = require("express");
const cors = require("cors");
const passport = require("../../../../helpers/passportHelper");
const Administrators = require("../../../../models/administrators");

var router = express.Router();
router.use(cors());

// POST: generalSettings
router.post("/generalSettings", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let updatedAdministrator = {
                    FirstName: request.body.FirstName,
                    LastName: request.body.LastName,
                    PhoneNumber: request.body.PhoneNumber
                };

                Administrators.update(updatedAdministrator, { where: { AdministratorID: result.Administrator.AdministratorID } }).then(() => {
                    response.json({
                        Message: "Administrator is updated."
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