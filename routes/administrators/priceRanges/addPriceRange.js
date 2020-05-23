const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const PriceRanges = require("../../../models/priceRanges");

var router = express.Router();
router.use(cors());

// POST: addPriceRange
router.post("/addPriceRange", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let newPriceRange = {
                    StartRange: request.body.StartRange,
                    EndRange: request.body.EndRange,
                    FeeRate: request.body.FeeRate,
                };

                PriceRanges.create(newPriceRange).then(priceRange => {
                    response.json({
                        Message: "Price range is added.",
                        PriceRange: priceRange
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