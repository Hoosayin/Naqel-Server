const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TemporaryFeeRateHelper = require("../../../helpers/temporaryFeeRateHelper");

var router = express.Router();
router.use(cors());

// POST: clearTemporaryFeeRate
router.post("/clearTemporaryFeeRate", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TemporaryFeeRateHelper.SetTemporaryFeeRateData(null);

                response.json({
                    Message: "Temporary fee rate is cleared."
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