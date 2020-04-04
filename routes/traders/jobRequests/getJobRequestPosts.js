const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");
const Trucks = require("../../../models/trucks");
const Trailers = require("../../../models/trailers");
const JobRequests = require("../../../models/jobRequests");

var router = express.Router();
router.use(cors());

// GET: getJobOffers
router.get("/getJobRequestPosts", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, async result => {
        try {
            if (result.Message === "Trader found.") {
                const drivers = await Drivers.findAll();

                if (drivers) {
                    let jobRequestPosts = [];
                    let count = 0;

                    for (let driver of drivers) {
                        const jobRequests = await JobRequests.findAll({
                            where: { DriverID: driver.DriverID }
                        });

                        if (jobRequests && jobRequests.length > 0) {
                            const truck = await Trucks.findOne({
                                where: { DriverID: driver.DriverID }
                            });

                            if (truck) {
                                const trailers = await Trailers.findAll({
                                    where: { TruckID: truck.TruckID }
                                });

                                jobRequestPosts[count++] = {
                                    Driver: driver,
                                    JobRequests: jobRequests,
                                    Truck: truck,
                                    Trailers: trailers
                                };

                                console.log("JOB REQUEST POST");
                                console.log(jobRequestPosts);
                            }
                        }
                    }

                    console.log("HEY HEY HEY!!");

                    if (jobRequestPosts.length > 0) {
                        response.json({
                            Message: "Job request posts found.",
                            JobRequestPosts: jobRequestPosts
                        });
                    }
                    else {
                        response.json({
                            Message: "Job request posts not found."
                        });
                    }
                }
                else {
                    response.json({
                        Message: "Drivers not found."
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