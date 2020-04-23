const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const OnGoingJobs = require("../../../models/onGoingJobs");
const JobObjections = require("../../../models/jobObjections");

var router = express.Router();
router.use(cors());

// POST: finishJob
router.post("/finishJob", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                OnGoingJobs.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(onGoingJob => {
                    if (onGoingJob) {
                        JobObjections.findOne({
                            where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                        }).then(jobObjection => {
                            if (jobObjection) {
                                response.json({
                                    Message: "On-going job has objections."
                                });
                            }
                            else {
                                let updatedOnGoingJob = {
                                    CompletedByDriver: true
                                };

                                OnGoingJobs.update(updatedOnGoingJob, { where: { OnGoingJobID: onGoingJob.OnGoingJobID } }).then(() => {
                                    response.json({
                                        Message: "Job is finished."
                                    });
                                });
                            }
                        });
                    }
                    else {
                        response.json({
                            Message: "On-going job not found."
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