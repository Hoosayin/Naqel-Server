const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const GlobalFeeRateHelper = require("../../../helpers/globalFeeRateHelper");

var router = express.Router();
router.use(cors());

// POST: setGlobalFeeRate
router.post("/setGlobalFeeRate", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                GlobalFeeRateHelper.SetGlobalFeeRate(request.body.FeeRate);

                response.json({
                    Message: "Global fee rate is set."
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