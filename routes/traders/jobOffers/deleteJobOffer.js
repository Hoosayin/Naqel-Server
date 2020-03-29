const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobOffers = require("../../../models/jobOffers");

var router = express.Router();
router.use(cors());

// POST: deleteJobOffer
router.delete("/deleteJobOffer", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                JobOffers.findOne({
                    where: { JobOfferID: request.body.JobOfferID }
                }).then(jobOffer => {
                    if (jobOffer) {
                        jobOffer.destroy();

                        response.json({
                            Message: "Job offer is deleted."
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
                    Message: "Trader not found."
                });
            }
        } catch (error) {
            response.json({
                Message: error.Message,
            });
        }
    })(request, response);
});

module.exports = router;