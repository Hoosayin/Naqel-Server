const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const OnGoingJobs = require("../../../models/onGoingJobs");
const JobObjections = require("../../../models/jobObjections");

var router = express.Router();
router.use(cors());

// GET: getOnGoingJob
router.get("/getOnGoingJob", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                OnGoingJobs.findOne({
                    where: { TraderID: result.Trader.TraderID }
                }).then(async onGoingJob => {
                    if (onGoingJob) {
                        const jobObjection = await JobObjections.findOne({
                            where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                        });

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