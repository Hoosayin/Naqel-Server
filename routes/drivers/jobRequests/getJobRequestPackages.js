const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobRequests = require("../../../models/jobRequests");
const OnGoingJobs = require("../../../models/onGoingJobs");
const TraderRequests = require("../../../models/traderRequests");

var router = express.Router();
router.use(cors());

// GET: getJobRequestPackages
router.get("/getJobRequestPackages", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, async result => {
        try {
            if (result.Message === "Driver found.") {
                const onGoingJob = await OnGoingJobs.findOne({
                    where: { DriverID: result.Driver.DriverID }
                });

                const driverOnJob = onGoingJob ? true : false;

                const jobRequests = await JobRequests.findAll({
                    where: { DriverID: result.Driver.DriverID }
                });

                let modifiableJobRequests = {};

                for (let jobRequest of jobRequests) {
                    const numberOfTraderRequests = await TraderRequests.count({
                        where: { JobRequestID: jobRequest.JobRequestID }
                    });

                    jobRequest.NumberOfTraderRequests = numberOfTraderRequests;
                    modifiableJobRequests = jobRequest;
                }

                if (jobRequests && jobRequests.length > 0) {
                    response.json({
                        Message: "Job request packages found.",
                        JobRequests: modifiableJobRequests,
                        DriverOnJob: driverOnJob
                    });
                }
                else {
                    response.json({
                        Message: "Job request packages not found."
                    });
                }
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