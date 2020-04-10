const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobRequests = require("../../../models/jobRequests");
const TraderRequests = require("../../../models/traderRequests");

var router = express.Router();
router.use(cors());

// POST: deleteJobRequest
router.delete("/deleteJobRequest", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                JobRequests.findOne({
                    where: { JobRequestID: request.body.JobRequestID }
                }).then(jobRequest => {
                    if (jobRequest) {
                        TraderRequests.destroy({
                            where: { JobRequestID: jobRequest.JobRequestID }
                        }).then(() => {
                            jobRequest.destroy();

                            response.json({
                                Message: "Job request is deleted."
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Job request not found."
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