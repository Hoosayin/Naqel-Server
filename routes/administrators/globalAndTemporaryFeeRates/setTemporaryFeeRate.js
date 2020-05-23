const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TemporaryFeeRateHelper = require("../../../helpers/temporaryFeeRateHelper");

var router = express.Router();
router.use(cors());

// POST: setTemporaryFeeRate
router.post("/setTemporaryFeeRate", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let temporaryFeeRateData = {
                    FeeRate: request.body.FeeRate,
                    Date: request.body.Date
                };

                TemporaryFeeRateHelper.SetTemporaryFeeRateData(temporaryFeeRateData);

                response.json({
                    Message: "Temporary fee rate is set."
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