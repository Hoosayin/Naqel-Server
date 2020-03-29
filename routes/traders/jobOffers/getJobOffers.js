const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobOffers = require("../../../models/jobOffers");

var router = express.Router();
router.use(cors());

// GET: getJobOffers
router.get("/getJobOffers", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                JobOffers.findAll({
                    where: { TraderID: result.Trader.TraderID }
                }).then(jobOffers => {
                    if (jobOffers) {
                        for (jobOffer in jobOffers) {
                            jobOffer = jobOffer.dataValues;
                        }

                        response.json({
                            Message: "Job offers found.",
                            JobOffers: jobOffers
                        });
                    }
                    else {
                        response.json({
                            Message: "Job offers not found."
                        });
                    }
                });
            }
            else {
                response.json({
                    Message: "Trader not found."
                });
            }
        } catch (error) {
            response.json({
                Message: error.Message
            });
        }
    })(request, response);
});

module.exports = router;