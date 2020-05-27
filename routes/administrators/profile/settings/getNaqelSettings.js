const express = require("express");
const cors = require("cors");
const passport = require("../../../../helpers/passportHelper");
const NaqelSettingsHelper = require("../../../../helpers/naqelSettingsHelper");

var router = express.Router();
router.use(cors());

// GET: getNaqelSettings
router.get("/getNaqelSettings", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                NaqelSettingsHelper.GetNaqelSettings(result => {
                    if (result.Message === "Naqel settings found.") {
                        response.json({
                            Message: "Naqel settings found.",
                            NaqelSettings: result.NaqelSettings
                        });
                    }
                    else {
                        response.json({
                            Message: "Naqel settings not found."
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