const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const CompletedJobs = require("../../../models/completedJobs");
const DriverReviews = require("../../../models/driverReviews");
const Drivers = require("../../../models/drivers");
const DriverProfilePhotos = require("../../../models/driverProfilePhotos");
const Traders = require("../../../models/traders");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");

var router = express.Router();
router.use(cors());

// GET: getTruckJobDetails
router.get("/getTruckJobDetails", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, (result) => {
        try {
            if (result.Message === "Transport company responsible found.") {
                CompletedJobs.findOne({
                    where: { CompletedJobID: request.query.CompletedJobID }
                }).then(async completedJob => {
                    if (completedJob) {
                        const driverReview = await DriverReviews.findOne({
                            where: { CompletedJobID: completedJob.CompletedJobID }
                        });

                        const driver = await Drivers.findOne({
                            attributes: ["FirstName", "LastName", "Username"],
                            where: { DriverID: completedJob.DriverID }
                        });

                        const driverProfilePhoto = await DriverProfilePhotos.findOne({
                            attributes: ["PhotoURL"],
                            where: { DriverID: completedJob.DriverID }
                        });

                        let mutableDriver = driver.dataValues;
                        mutableDriver.PhotoURL = driverProfilePhoto ? driverProfilePhoto.PhotoURL : null;

                        const trader = await Traders.findOne({
                            attributes: ["FirstName", "LastName", "Username", "Type"],
                            where: { TraderID: completedJob.TraderID }
                        });

                        const traderProfilePhoto = await TraderProfilePhotos.findOne({
                            attributes: ["PhotoURL"],
                            where: { TraderID: completedJob.TraderID }
                        });

                        let mutableTrader = trader.dataValues;
                        mutableTrader.PhotoURL = traderProfilePhoto ? traderProfilePhoto.PhotoURL : null;

                        let mutableCompletedJob = completedJob.dataValues;
                        mutableCompletedJob.DriverReview = driverReview;
                        mutableCompletedJob.Driver = mutableDriver;
                        mutableCompletedJob.Trader = mutableTrader;

                        response.json({
                            Message: "Truck job details found.",
                            TruckJobDetails: mutableCompletedJob
                        });
                    }
                    else {
                        response.json({
                            Message: "Completed job not found."
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