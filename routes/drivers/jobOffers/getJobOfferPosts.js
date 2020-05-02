const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
const JobOffers = require("../../../models/jobOffers");
const DriverRequests = require("../../../models/driverRequests");

var router = express.Router();
router.use(cors());

// GET: getJobOfferPosts
router.get("/getJobOfferPosts", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                JobOffers.findAll().then(async jobOffers => {
                    if (jobOffers) {
                        let jobOfferPosts = [];
                        let count = 0;

                        for (let jobOffer of jobOffers) {
                            const trader = await Traders.findOne({
                                attributes: ["FirstName", "LastName"],
                                where: { TraderID: jobOffer.TraderID }
                            });

                            const driverRequest = await DriverRequests.findOne({
                                where: {
                                    [Op.and]: [
                                        { JobOfferID: jobOffer.JobOfferID },
                                        { DriverID: result.Driver.DriverID }
                                    ]
                                }
                            });

                            jobOfferPosts[count++] = {
                                JobOffer: jobOffer,
                                Trader: trader,
                                DriverRequest: driverRequest
                            };
                        }

                        jobOfferPosts.sort((a, b) => {
                            let dateA = new Date(a.JobOffer.TimeCreated);
                            let dateB = new Date(b.JobOffer.TimeCreated);
                            return dateB - dateA;
                        });

                        response.json({
                            Message: "Job offer posts found.",
                            JobOfferPosts: jobOfferPosts
                        });
                    }
                    else {
                        response.json({
                            Message: "Job offer posts not found."
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