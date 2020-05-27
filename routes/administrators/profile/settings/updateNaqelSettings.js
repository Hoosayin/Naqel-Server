const express = require("express");
const cors = require("cors");
const passport = require("../../../../helpers/passportHelper");
const NaqelSettingsHelper = require("../../../../helpers/naqelSettingsHelper");

var router = express.Router();
router.use(cors());

// POST: updateNaqelSettings
router.post("/updateNaqelSettings", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let updatedNaqelSettings = {
                    Street: request.body.Street,
                    City: request.body.City,
                    Country: request.body.Country,
                    ZIPCode: request.body.ZIPCode,
                    PhoneNumber: request.body.PhoneNumber,
                    Website: request.body.Website,
                    BusinessName: request.body.BusinessName,
                    BankName: request.body.BankName,
                    AccountNumber: request.body.AccountNumber,
                };

                NaqelSettingsHelper.SetNaqelSettings(updatedNaqelSettings);

                response.json({
                    Message: "Naqel settings are updated."
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