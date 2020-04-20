const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");
const TraderIdentityCards = require("../../../models/traderIdentityCards");
const TraderCommercialRegisterCertificates = require("../../../models/traderCommercialRegisterCertificates");
const OnGoingJobs = require("../../../models/onGoingJobs");

var router = express.Router();
router.use(cors());

// GET: getOnGoingJobPackage
router.get("/getOnGoingJobPackage", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, async result => {
        try {
            if (result.Message === "Driver found.") {
                const onGoingJob = await OnGoingJobs.findOne({
                    where: { DriverID: result.Driver.DriverID }
                });

                if (onGoingJob) {
                    const trader = await Traders.findOne({
                        where: { TraderID: onGoingJob.TraderID }
                    });

                    const traderProfilePhoto = await TraderProfilePhotos.findOne({
                        where: { TraderID: trader.TraderID }
                    });

                    const identityCard = await TraderIdentityCards.findOne({
                        where: { TraderID: trader.TraderID }
                    });

                    const commercialRegisterCertificate = await TraderCommercialRegisterCertificates.findOne({
                        where: { TraderID: trader.TraderID }
                    });

                    let onGoingJobPackage = {
                        OnGoingJob: onGoingJob,
                        Trader: trader,
                        ProfilePhoto: traderProfilePhoto ? traderProfilePhoto.PhotoURL : null,
                        IdentityCard: identityCard,
                        CommercialRegisterCertificate: commercialRegisterCertificate
                    };

                    response.json({
                        Message: "On-going job package found.",
                        OnGoingJobPackage: onGoingJobPackage
                    });
                }
                else {
                    response.json({
                        Message: "On-going job package not found."
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