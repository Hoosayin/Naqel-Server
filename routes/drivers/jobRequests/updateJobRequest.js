const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobRequests = require("../../../models/jobRequests");

var router = express.Router();
router.use(cors());

// POST: updateJobRequest
router.post("/updateJobRequest", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                JobRequests.findOne({
                    where: { JobRequestID: request.body.JobRequestID }
                }).then(jobRequest => {
                    if (jobRequest) {
                        let updatedJobRequest = {
                            LoadingPlace: request.body.LoadingPlace,
                            LoadingLat: request.body.LoadingLat,
                            LoadingLng: request.body.LoadingLng,
                            UnloadingPlace: request.body.UnloadingPlace,
                            UnloadingLat: request.body.UnloadingLat,
                            UnloadingLng: request.body.UnloadingLng,
                            TripType: request.body.TripType,
                            Price: request.body.Price,
                            WaitingTime: request.body.WaitingTime,
                        };

                        JobRequests.update(updatedJobRequest, { where: { JobRequestID: jobRequest.JobRequestID } }).then(() => {
                            response.json({
                                Message: "Job request is updated."
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