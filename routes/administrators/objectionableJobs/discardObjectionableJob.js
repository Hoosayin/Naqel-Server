const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const OnGoingJobs = require("../../../models/onGoingJobs");
const JobObjections = require("../../../models/jobObjections");

var router = express.Router();
router.use(cors());

// DELETE: discardObjectionableJob
router.delete("/discardObjectionableJob", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                OnGoingJobs.findOne({
                    where: { OnGoingJobID: request.body.OnGoingJobID }
                }).then(onGoingJob => {
                    if (onGoingJob) {
                        JobObjections.findOne({
                            where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                        }).then(jobObjection => {
                            if (jobObjection) {
                                JobObjections.destroy({
                                    where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                                }).then(() => {
                                    onGoingJob.destroy();

                                    response.json({
                                        Message: "Objectionable job is discarded."
                                    });
                                });
                            }
                            else {
                                response.json({
                                    Message: "On-going job is not objectionable."
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