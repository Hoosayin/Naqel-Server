const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const OnGoingJobs = require("../../../models/onGoingJobs");
const JobObjections = require("../../../models/jobObjections");

var router = express.Router();
router.use(cors());

// POST: addJobObjection
router.post("/addJobObjection", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                OnGoingJobs.findOne({
                    where: { OnGoingJobID: request.body.OnGoingJobID }
                }).then(onGoingJob => {
                    if (onGoingJob) {
                        let newJobObjection = {
                            OnGoingJobID: onGoingJob.OnGoingJobID,
                            DriverID: result.Driver.DriverID,
                            TraderID: null,
                            Reason: request.body.Reason,
                            Comment: request.body.Comment,
                            ObjectionBy: "Driver",
                            Created: new Date()
                        };

                        JobObjections.create(newJobObjection).then(objectionReason => {
                            response.json({
                                Message: "Job objection is added."
                            });
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