const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");
const DriverProfilePhotos = require("../../../models/driverProfilePhotos");
const BlockedDrivers = require("../../../models/blockedDrivers");

var router = express.Router();
router.use(cors());

// GET: getDrivers
router.get("/getDrivers", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                Drivers.findAll({
                    attributes: ["DriverID", "Username", "Email", "FirstName", "LastName", "Active"]
                }).then(async drivers => {
                    if(drivers) {
                        let modifiableDrivers = [];
                        let count = 0;

                        for (let driver of drivers) {
                            const driverProfilePhoto = await DriverProfilePhotos.findOne({
                                where: { DriverID: driver.DriverID }
                            });

                            let blockedDriver = await BlockedDrivers.findOne({
                                where: { DriverID: driver.DriverID }
                            });

                            if (blockedDriver) {
                                const dateDifference = new Date(blockedDriver.BlockDate) - new Date();

                                if (dateDifference < 0) {
                                    blockedDriver.destroy();
                                    blockedDriver = null;
                                }
                            }

                            let modifiableDriver = driver.dataValues;
                            modifiableDriver.PhotoURL = driverProfilePhoto ? driverProfilePhoto.PhotoURL : null;
                            modifiableDriver.IsBlocked = blockedDriver ? true : false;

                            modifiableDrivers[count++] = modifiableDriver;
                        }

                        response.json({
                            Message: "Drivers found.",
                            Drivers: modifiableDrivers
                        });
                    }
                    else {
                        response.json({
                            Message: "Drivers not found."
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