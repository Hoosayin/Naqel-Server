const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobRequests = require("../../../models/jobRequests");
const TraderRequests = require("../../../models/traderRequests");
const Traders = require("../../../models/traders");
const OnGoingJobs = require("../../../models/onGoingJobs");

var router = express.Router();
router.use(cors());

// GET: getTraderRequestPackages
router.get("/getTraderRequestPackages", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                JobRequests.findOne({
                    where: { JobRequestID: request.query.JobRequestID }
                }).then(jobRequest => {
                    if (jobRequest) {
                        TraderRequests.findAll({
                            where: { JobRequestID: jobRequest.JobRequestID }
                        }).then(async traderRequests => {
                            if (traderRequests) {
                                let traderRequestPackages = [];
                                let count = 0;

                                for (let traderRequest of traderRequests) {
                                    const trader = await Traders.findOne({
                                        attributes: ["FirstName", "LastName"],
                                        where: { TraderID: traderRequest.TraderID }
                                    });

                                    const onGoingJob = await OnGoingJobs.findOne({
                                        where: { TraderID: traderRequest.TraderID }
                                    });

                                    traderRequestPackages[count++] = {
                                        TraderRequest: traderRequest,
                                        Trader: trader,
                                        TraderOnJob: onGoingJob ? true : false
                                    };
                                }

                                let requestSelected = false;

                                for (let traderRequest of traderRequests) {
                                    if (traderRequest.Selected) {
                                        requestSelected = true;
                                        break;
                                    }
                                }

                                if (traderRequestPackages.length > 0) {
                                    traderRequestPackages.sort((a, b) => {
                                        let dateA = new Date(a.TraderRequest.Created);
                                        let dateB = new Date(b.TraderRequest.Created);
                                        return dateB - dateA;
                                    });
                                }

                                response.json({
                                    Message: "Trader request packages found.",
                                    TraderRequestPackages: traderRequestPackages,
                                    RequestSelected: requestSelected
                                });
                            }
                            else {
                                response.json({
                                    Message: "Trader requests not found."
                                });
                            }
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