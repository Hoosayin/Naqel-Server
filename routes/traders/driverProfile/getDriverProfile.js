const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");
const DriverProfilePhotos = require("../../../models/driverProfilePhotos");
const OnGoingJobs = require("../../../models/onGoingJobs");
const DriverReviews = require("../../../models/driverReviews");

var router = express.Router();
router.use(cors());

// GET: getDriverProfile
router.get("/getDriverProfile", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                Drivers.findOne({
                    where: { DriverID: request.query.DriverID }
                }).then(driver => {
                    if (driver) {
                        DriverProfilePhotos.findOne({
                            where: { DriverID: driver.DriverID }
                        }).then(async driverProfilePhoto => {
                            const onGoingJob = await OnGoingJobs.findOne({
                                where: { DriverID: driver.DriverID }
                            });

                            const driverReviews = await DriverReviews.findAndCountAll({
                                where: { DriverID: driver.DriverID }
                            });

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

                            let driverProfile = {
                                Driver: driver,
                                ProfilePhoto: driverProfilePhoto ? driverProfilePhoto.PhotoURL : null,
                                RatingAndReviews: driverReviewsAggregation,
                                OnJob: onGoingJob ? true : false
                            };

                            response.json({
                                Message: "Driver profile found.",
                                DriverProfile: driverProfile
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Driver not found."
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