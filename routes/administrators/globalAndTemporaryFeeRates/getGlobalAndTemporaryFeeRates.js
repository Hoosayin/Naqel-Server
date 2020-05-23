const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const GlobalFeeRateHelper = require("../../../helpers/globalFeeRateHelper");
const TemporaryFeeRateHelper = require("../../../helpers/temporaryFeeRateHelper");

var router = express.Router();
router.use(cors());

// GET: getGlobalAndTemporaryFeeRates
router.get("/getGlobalAndTemporaryFeeRates", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                GlobalFeeRateHelper.GetGlobalFeeRate(result => {
                    let globalFeeRate = result.Message === "Global fee rate found." ?
                        result.FeeRate : null;

                    TemporaryFeeRateHelper.GetTemporaryFeeRateData(result => {
                        let temporaryFeeRateData = result.Message === "Temporary fee rate data found." ?
                            result.TemporaryFeeRateData : null;

                        response.json({
                            Message: "Global and temporary fee rates found.",
                            GlobalFeeRate: globalFeeRate,
                            TemporaryFeeRateData: temporaryFeeRateData
                        });
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
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;