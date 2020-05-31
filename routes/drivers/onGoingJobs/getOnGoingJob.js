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
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                OnGoingJobs.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(async onGoingJob => {
                    if (onGoingJob) {
                        const jobObjection = await JobObjections.findOne({
                            where: { OnGoingJobID: onGoingJob.OnGoingJobID }
                        });

                        let trader = await Traders.findOne({
                            attributes: ["FirstName", "LastName"],
                            where: { TraderID: onGoingJob.TraderID }
                        });

                        const traderProfilePhoto = await TraderProfilePhotos.findOne({
                            attributes: ["PhotoURL"],
                            where: { TraderID: onGoingJob.TraderID }
                        });

                        trader = trader.dataValues;
                        trader.PhotoURL = traderProfilePhoto ? traderProfilePhoto.PhotoURL : null;

                        let driver = await Drivers.findOne({
                            attributes: ["FirstName", "LastName"],
                            where: { DriverID: onGoingJob.DriverID }
                        });

                        const driverProfilePhoto = await DriverProfilePhotos.findOne({
                            attributes: ["PhotoURL"],
                            where: { DriverID: onGoingJob.DriverID }
                        });

                        driver = driver.dataValues;
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