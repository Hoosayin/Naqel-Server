const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");

var router = express.Router();
router.use(cors());

// GET: getTrader
router.get("/getTrader", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                response.json({
                    Message: "Trader found.",
                    Trader: result.Trader
                });
            }
            else {
                response.json({
                    Message: "Trader not found."
                });
            }
        } catch (error) {
            response.json({
                Message: "Trader not found.",
            });
        }
    })(request, response);
});

module.exports = router;