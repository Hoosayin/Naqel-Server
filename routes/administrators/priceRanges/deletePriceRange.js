const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const PriceRanges = require("../../../models/priceRanges");

var router = express.Router();
router.use(cors());

// POST: deletePriceRange
router.delete("/deletePriceRange", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                PriceRanges.findOne({
                    where: { PriceRangeID: request.body.PriceRangeID }
                }).then(priceRange => {
                    if (priceRange) {
                        priceRange.destroy();

                        response.json({
                            Message: "Price range is deleted."
                        });
                    }
                    else {
                        response.json({
                            Message: "Price range not found."
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
                Message: error.message,
            });
        }
    })(request, response);
});

module.exports = router;