const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const PermitTypes = require("../../../models/permitTypes");

var router = express.Router();
router.use(cors());

// POST: addPermitType
router.post("/addPermitType", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let newPermitType = { 
                    PermitType: request.body.PermitType
                };

                PermitTypes.create(newPermitType).then(() => {
                    response.json({
                        Message: "Permit type is added."
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