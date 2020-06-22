const express = require("express");
const cors = require("cors");
const Drivers = require("../../../models/drivers");
const DriverProfilePhotos = require("../../../models/driverProfilePhotos");
const OnGoingJobs = require("../../../models/onGoingJobs");
const DriverReviews = require("../../../models/driverReviews");

var router = express.Router();
router.use(cors());

// GET: getDriverProfile
router.get("/getDriverProfile", (request, response) => {
    try {
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

                    driver = driver.dataValues;
                    driver.PhotoURL = driverProfilePhoto ? driverProfilePhoto.PhotoURL : null;

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
    } catch (error) {
        response.json({
            Message: error.message
        });
    }
});

module.exports = router;