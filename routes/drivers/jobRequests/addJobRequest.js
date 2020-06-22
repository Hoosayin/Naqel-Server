const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobRequests = require("../../../models/jobRequests");

var router = express.Router();
router.use(cors());

// POST: addJobRequest
router.post("/addJobRequest", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                let newJobRequest = {
                    DriverID: result.Driver.DriverID,
                    LoadingPlace: request.body.LoadingPlace,
                    LoadingLat: request.body.LoadingLat,
                    LoadingLng: request.body.LoadingLng,
                    UnloadingPlace: request.body.UnloadingPlace,
                    UnloadingLat: request.body.UnloadingLat,
                    UnloadingLng: request.body.UnloadingLng,
                    TripType: request.body.TripType,
                    Price: request.body.Price,
                    WaitingTime: request.body.WaitingTime,
                    TimeCreated: new Date()
                };

                JobRequests.create(newJobRequest).then(() => {
                    response.json({
                        Message: "Job request is added."
                    });
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