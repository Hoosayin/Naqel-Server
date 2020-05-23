const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const PriceRanges = require("../../../models/priceRanges");

var router = express.Router();
router.use(cors());

// GET: getPriceRanges
router.get("/getPriceRanges", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                PriceRanges.findAll().then(priceRanges => {
                    if (priceRanges) {
                        response.json({
                            Message: "Price ranges found.",
                            PriceRanges: priceRanges
                        });
                    }
                    else {
                        response.json({
                            Message: "Price ranges not found."
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