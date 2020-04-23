const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const CompletedJobs = require("../../../models/completedJobs");
const DriverReviews = require("../../../models/driverReviews");

var router = express.Router();
router.use(cors());

// GET: getCompletedJobPackages
router.get("/getCompletedJobPackages", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                CompletedJobs.findAll({
                    where: { DriverID: result.Driver.DriverID }
                }).then(async completedJobs => {
                    if (completedJobs) {
                        let completedJobPackages = [];
                        let count = 0;

                        for (let completedJob of completedJobs) {
                            const driverReview = await DriverReviews.findOne({
                                where: { CompletedJobID: completedJob.CompletedJobID }
                            });

                            completedJobPackages[count++] = {
                                CompletedJob: completedJob,
                                DriverReview: driverReview
                            };
                        }

                        if (completedJobPackages.length > 0) {
                            completedJobPackages.sort((a, b) => {
                                let dateA = new Date(a.CompletedJob.Created);
                                let dateB = new Date(b.CompletedJob.Created);
                                return dateB - dateA;
                            });
                        }

                        response.json({
                            Message: "Completed job packages found.",
                            CompletedJobPackages: completedJobPackages
                        });
                    }
                    else {
                        response.json({
                            Message: "Completed jobs not found."
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