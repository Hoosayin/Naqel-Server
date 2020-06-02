const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Trucks = require("../../../models/trucks");
const CompletedJobs = require("../../../models/completedJobs");

var router = express.Router();
router.use(cors());

// GET: getTrucks
router.get("/getTruckJobs", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, (result) => {
        try {
            if (result.Message === "Transport company responsible found.") {
                Trucks.findOne({
                    attributes: ["TruckID"],
                    where: { TruckNumber: request.query.TruckNumber }
                }).then(truck => {
                    if (truck) {
                        CompletedJobs.findAll({
                            attributes: ["CompletedJobID", "JobNumber", "LoadingPlace", "UnloadingPlace", "Price", "Created"],
                            where: { TruckID: truck.TruckID }
                        }).then(completedJobs => {
                            if (true) {
                                let mutableTruckJobs = [];
                                let count = 0;

                                for (let completedJob of completedJobs) {
                                    completedJob = completedJob.dataValues;
                                    completedJob.TruckNumber = request.query.TruckNumber;

                                    mutableTruckJobs[count++] = completedJob;
                                }

                                if (mutableTruckJobs.length > 0) {
                                    mutableTruckJobs.sort((a, b) => {
                                        let dateA = new Date(a.Created);
                                        let dateB = new Date(b.Created);
                                        return dateB - dateA;
                                    });
                                }

                                response.json({
                                    Message: "Truck jobs found.",
                                    TruckJobs: mutableTruckJobs
                                });
                            }
                            else {
                                response.json({
                                    Message: "Truck jobs not found."
                                });
                            }
                        });
                    }
                    else {
                        response.json({
                            Message: "Truck not found."
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