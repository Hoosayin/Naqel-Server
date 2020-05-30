const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");
const DriverProfilePhotos = require("../../../models/driverProfilePhotos");
const Traders = require("../../../models/traders");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");
const OnGoingJobs = require("../../../models/onGoingJobs");
const JobObjections = require("../../../models/jobObjections");

var router = express.Router();
router.use(cors());

// GET: getOnGoingJob
router.get("/getOnGoingJob", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                OnGoingJobs.findOne({
                    where: { TraderID: result.Trader.TraderID }
                }).then(async onGoingJob => {
                    if (onGoingJob) {
                        const jobObjection = await JobObjections.findOne({
                            where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                        });

                        let trader = await Traders.findOne({
                            attributes: ["FirstName", "LastName"],
                            where: { TraderID: onGoingJob.TraderID }
                        }).dataValues;

                        const traderProfilePhoto = await TraderProfilePhotos.findOne({
                            attributes: ["PhotoURL"],
                            where: { TraderID: onGoingJob.TraderID }
                        });

                        trader.PhotoURL = traderProfilePhoto ? traderProfilePhoto.PhotoURL : null;

                        let driver = await Drivers.findOne({
                            attributes: ["FirstName", "LastName"],
                            where: { DriverID: onGoingJob.DriverID }
                        }).dataValues;

                        const driverProfilePhoto = await DriverProfilePhotos.findOne({
                            attributes: ["PhotoURL"],
                            where: { DriverID: onGoingJob.DriverID }
                        });

                        driver.PhotoURL = driverProfilePhoto ? driverProfilePhoto.PhotoURL : null;

                        let modifiableOnGoingJob = onGoingJob.dataValues;
                        modifiableOnGoingJob.Trader = trader;
                        modifiableOnGoingJob.Driver = driver;

                        response.json({
                            Message: "On-going job found.",
                            OnGoingJob: modifiableOnGoingJob,
                            HasObjections: jobObjection ? true : false
                        });
                    }
                    else {
                        response.json({
                            Message: "On-going job not found."
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