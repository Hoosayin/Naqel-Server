const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobOffers = require("../../../models/jobOffers");
const DriverRequests = require("../../../models/driverRequests");
const Drivers = require("../../../models/drivers");
const OnGoingJobs = require("../../../models/onGoingJobs");

var router = express.Router();
router.use(cors());

// GET: getDriverRequestPackages
router.get("/getDriverRequestPackages", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                JobOffers.findOne({
                    where: { JobOfferID: request.query.JobOfferID }
                }).then(jobOffer => {
                    if (jobOffer) {
                        DriverRequests.findAll({
                            where: { JobOfferID: jobOffer.JobOfferID }
                        }).then(async driverRequests => {
                            if (driverRequests) {
                                let driverRequestPackages = [];
                                let count = 0;

                                for (let driverRequest of driverRequests) {
                                    const driver = await Drivers.findOne({
                                        attributes: ["FirstName", "LastName"],
                                        where: { DriverID: driverRequest.DriverID }
                                    });

                                    const onGoingJob = await OnGoingJobs.findOne({
                                        where: { DriverID: driverRequest.DriverID }
                                    });

                                    driverRequestPackages[count++] = {
                                        DriverRequest: driverRequest,
                                        Driver: driver,
                                        DriverOnJob: onGoingJob ? true : false
                                    };
                                }

                                if (driverRequestPackages.length > 0) {
                                    driverRequestPackages.sort((a, b) => {
                                        let dateA = new Date(a.DriverRequest.Created);
                                        let dateB = new Date(b.DriverRequest.Created);
                                        return dateB - dateA;
                                    });
                                }

                                response.json({
                                    Message: "Driver request packages found.",
                                    DriverRequestPackages: driverRequestPackages
                                })
                            }
                            else {
                                response.json({
                                    Message: "Driver requests not found."
                                });
                            }
                        });
                    }
                    else {
                        response.json({
                            Message: "Job offer not found."
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