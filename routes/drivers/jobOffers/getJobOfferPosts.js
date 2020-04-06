const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");
const TraderCommercialRegisterCertificates = require("../../../models/traderCommercialRegisterCertificates");
const TraderIdentityCards = require("../../../models/traderIdentityCards");
const JobOffers = require("../../../models/jobOffers");

var router = express.Router();
router.use(cors());

// GET: getJobOfferPosts
router.get("/getJobOfferPosts", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, async result => {
        try {
            if (result.Message === "Driver found.") {
                const traders = await Traders.findAll();

                if (traders) {
                    let jobOfferPosts = [];
                    let count = 0;

                    for (let trader of traders) {
                        const jobOffers = await JobOffers.findAll({
                            where: { TraderID: trader.TraderID }
                        });

                        if (jobOffers && jobOffers.length > 0) {
                            const traderProfilePhoto = await TraderProfilePhotos.findOne({
                                where: { TraderID: trader.TraderID }
                            });

                            const traderIdentityCard = await TraderIdentityCards.findOne({
                                where: { TraderID: trader.TraderID }
                            });

                            const traderCommercialRegisterCertificate = await TraderCommercialRegisterCertificates.findOne({
                                where: { TraderID: trader.TraderID }
                            });

                            for (let jobOffer of jobOffers) {
                                jobOfferPosts[count++] = {
                                    JobOffer: jobOffer,
                                    Trader: trader,
                                    ProfilePhoto: traderProfilePhoto,
                                    IdentityCard: traderIdentityCard,
                                    CommercialRegisterCertificate: traderCommercialRegisterCertificate
                                };
                            }
                        }
                    }

                    if (jobOfferPosts.length > 0) {
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
                }
                else {
                    response.json({
                        Message: "Traders not found."
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