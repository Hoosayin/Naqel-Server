const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const OnGoingJobs = require("../../../models/onGoingJobs");
const JobObjections = require("../../../models/jobObjections");

var router = express.Router();
router.use(cors());

// GET: getObjectionableJobs
router.get("/getObjectionableJobs", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                OnGoingJobs.findAll().then(async onGoingJobs => {
                    if (onGoingJobs) {
                        let objectionableJobs = [];
                        let count = 0;

                        for (let onGoingJob of onGoingJobs) {
                            const jobObjection = await JobObjections.findOne({
                                where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                            });

                            if (jobObjection) {
                                objectionableJobs[count++] = onGoingJob;
                            }
                        }

                        if (objectionableJobs.length > 0) {
                            objectionableJobs.sort((a, b) => {
                                let dateA = new Date(a.Created);
                                let dateB = new Date(b.Created);
                                return dateB - dateA;
                            });
                        }

                        response.json({
                            Message: "Objectionable jobs found.",
                            ObjectionableJobs: objectionableJobs
                        });
                    }
                    else {
                        response.json({
                            Message: "Objectionable jobs not found."
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