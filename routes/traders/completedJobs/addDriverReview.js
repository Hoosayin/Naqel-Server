const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const CompletedJobs = require("../../../models/completedJobs");
const DriverReviews = require("../../../models/driverReviews");

var router = express.Router();
router.use(cors());

// POST: addDriverReview
router.post("/addDriverReview", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                CompletedJobs.findOne({
                    where: { CompletedJobID: request.body.CompletedJobID }
                }).then(completedJob => {
                    if (completedJob) {
                        let newDriverReview = {
                            DriverID: completedJob.DriverID,
                            TraderID: result.Trader.TraderID,
                            CompletedJobID: completedJob.CompletedJobID,
                            Rating: request.body.Rating,
                            Review: request.body.Review,
                            Created: new Date()
                        };

                        DriverReviews.create(newDriverReview).then(driverReview => {
                            response.json({
                                Message: "Driver review is added.",
                                DriverReview: driverReview
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Completed job not found."
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