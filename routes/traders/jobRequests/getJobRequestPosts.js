const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");
const JobRequests = require("../../../models/jobRequests");
const TraderRequests = require("../../../models/traderRequests");

var router = express.Router();
router.use(cors());

// GET: getJobRequestPosts
router.get("/getJobRequestPosts", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                JobRequests.findAll().then(async jobRequests => {
                    if (jobRequests) {
                        let jobRequestPosts = [];
                        let count = 0;

                        for (let jobRequest of jobRequests) {
                            const driver = await Drivers.findOne({
                                attributes: ["FirstName", "LastName"],
                                where: { DriverID: jobRequest.DriverID }
                            });

                            const traderRequest = await TraderRequests.findOne({
                                where: {
                                    [Op.and]: [
                                        { JobRequestID: jobRequest.JobRequestID },
                                        { TraderID: result.Trader.TraderID }
                                    ]
                                }
                            });

                            jobRequestPosts[count++] = {
                                JobRequest: jobRequest,
                                Driver: driver,
                                RequestSent: traderRequest ? true : false
                            };
                        }

                        if (jobRequestPosts.length > 0) {
                            jobRequestPosts.sort((a, b) => {
                                let dateA = new Date(a.JobRequest.TimeCreated);
                                let dateB = new Date(b.JobRequest.TimeCreated);
                                return dateB - dateA;
                            });

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
                            Message: "Job request posts not found."
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