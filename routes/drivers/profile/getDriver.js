const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverReviews = require("../../../models/driverReviews");

var router = express.Router();
router.use(cors());

// GET: getDriver
router.get("/getDriver", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverReviews.findAndCountAll({
                    where: { DriverID: result.Driver.DriverID }
                }).then(driverReviews => {
                    let driverReviewsAggregation = null;

                    if (driverReviews) {
                        let count = driverReviews.count;
                        let rows = driverReviews.rows;
                        let sum = 0;

                        for (let driverReview of rows) {
                            sum += driverReview.Rating;
                        }

                        let averageRating = sum / count;

                        driverReviewsAggregation = {
                            Rating: averageRating,
                            Reviews: count
                        };
                    }

                    response.json({
                        Message: "Driver found.",
                        Driver: result.Driver,
                        RatingAndReviews: driverReviewsAggregation
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