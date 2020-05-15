const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobOffers = require("../../../models/jobOffers");
const DriverRequests = require("../../../models/driverRequests");
const OnGoingJobs = require("../../../models/onGoingJobs");

var router = express.Router();
router.use(cors());

// GET: getJobOfferPackages
router.get("/getJobOfferPackages", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                JobOffers.findAll({
                    where: { TraderID: result.Trader.TraderID }
                }).then(async jobOffers => {
                    if (jobOffers) {
                        const onGoingJob = await OnGoingJobs.findOne({
                            where: { TraderID: result.Trader.TraderID }
                        });

                        let jobOfferPackages = [];
                        let count = 0;
                        let traderOnJob = onGoingJob ? true : false;

                        for (let jobOffer of jobOffers) {
                            const driverRequest = await DriverRequests.findOne({
                                where: { JobOfferID: jobOffer.JobOfferID }
                            });

                            const numberOfDriverRequests = await DriverRequests.count({
                                where: { JobOfferID: jobOffer.JobOfferID }
                            });

                            let modifiableJobOffer = jobOffer.dataValues;
                            modifiableJobOffer.NumberOfDriverRequests = numberOfDriverRequests;

                            jobOfferPackages[count++] = {
                                JobOffer: modifiableJobOffer,
                                HasDriverRequests: driverRequest ? true : false
                            };
                        }

                        response.json({
                            Message: "Job offer packages found.",
                            JobOfferPackages: jobOfferPackages,
                            TraderOnJob: traderOnJob
                        });

                    }
                    else {
                        response.json({
                            Message: "Job offer packages not found."
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