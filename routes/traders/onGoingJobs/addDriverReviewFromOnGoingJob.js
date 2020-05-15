const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const OnGoingJobs = require("../../../models/onGoingJobs");
const CompletedJobs = require("../../../models/completedJobs");
const DriverReviews = require("../../../models/driverReviews");

var router = express.Router();
router.use(cors());

// POST: addDriverReviewFromOnGoingJob
router.post("/addDriverReviewFromOnGoingJob", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                OnGoingJobs.findOne({
                    where: { OnGoingJobID: request.body.OnGoingJobID }
                }).then(onGoingJob => {
                    if (onGoingJob) {
                        let newDriverReview = {
                            DriverID: onGoingJob.DriverID,
                            TraderID: result.Trader.TraderID,
                            CompletedJobID: null,
                            Rating: request.body.Rating,
                            Review: request.body.Review,
                            Created: new Date()
                        };

                        DriverReviews.create(newDriverReview).then(driverReview => {
                            let updatedOnGoingJob = {
                                DriverRated: true
                            };

                            OnGoingJobs.update(updatedOnGoingJob, { where: { OnGoingJobID: onGoingJob.OnGoingJobID } }).then(() => {
                                response.json({
                                    Message: "Driver review is added.",
                                    DriverReview: driverReview
                                });
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "On going job not found."
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