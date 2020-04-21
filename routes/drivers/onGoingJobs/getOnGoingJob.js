/// <reference path=".js" />
const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const OnGoingJobs = require("../../../models/onGoingJobs");
const JobObjections = require("../../../models/jobObjections");

var router = express.Router();
router.use(cors());

// GET: getOnGoingJob
router.get("/getOnGoingJob", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                OnGoingJobs.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(async onGoingJob => {
                    const jobObjection = await JobObjections.findOne({
                        where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                    });

                    if (onGoingJob) {
                        response.json({
                            Message: "On-going job found.",
                            OnGoingJob: onGoingJob,
                            HasObjections: jobObjection ? true : false
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