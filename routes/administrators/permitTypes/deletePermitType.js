const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const PermitTypes = require("../../../models/permitTypes");

var router = express.Router();
router.use(cors());

// POST: deletePermitType
router.delete("/deletePermitType", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                PermitTypes.findOne({
                    where: { PermitTypeID: request.body.PermitTypeID }
                }).then(permitType => {
                    if (permitType) {
                        permitType.destroy();

                        response.json({
                            Message: "Permit type is deleted."
                        });
                    }
                    else {
                        response.json({
                            Message: "Permit type not found."
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