const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const OnGoingJobs = require("../../../models/onGoingJobs");
const JobObjections = require("../../../models/jobObjections");

var router = express.Router();
router.use(cors());

// DELETE: deleteOnGoingJob
router.delete("/deleteOnGoingJob", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                OnGoingJobs.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(onGoingJob => {
                    if (onGoingJob) {
                        JobObjections.destroy({
                            where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                        }).then(() => {
                            onGoingJob.destroy();

                            response.json({
                                Message: "On-going job deleted."
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
                    Message: "Driver not found."
                });
            }
        } catch (error) {
            response.json({
                Message: error.Message,
            });
        }
    })(request, response);
});

module.exports = router;