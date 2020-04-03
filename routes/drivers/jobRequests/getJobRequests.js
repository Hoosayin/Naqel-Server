const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobRequests = require("../../../models/jobRequests");

var router = express.Router();
router.use(cors());

// GET: getJobRequests
router.get("/getJobRequests", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                JobRequests.findAll({
                    where: { DriverID: result.Driver.DriverID }
                }).then(jobRequests => {
                    if (jobRequests) {
                        for (jobRequest in jobRequests) {
                            jobRequest = jobRequest.dataValues;
                        }

                        response.json({
                            Message: "Job requests found.",
                            JobRequests: jobRequests
                        });
                    }
                    else {
                        response.json({
                            Message: "Permit licences not found."
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