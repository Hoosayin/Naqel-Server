const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");
const BlockedDrivers = require("../../../models/blockedDrivers");

var router = express.Router();
router.use(cors());

// POST: blockDriverAccount
router.post("/blockDriverAccount", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                Drivers.findOne({
                    where: { DriverID: request.body.DriverID }
                }).then(driver => {
                    if (driver) {
                        BlockedDrivers.findOne({
                            where: { DriverID: driver.DriverID }
                        }).then(blockedDriver => {
                            if (blockedDriver) {
                                response.json({
                                    Message: "Driver is already blocked."
                                });
                            }
                            else {
                                let newBlockedDriver = {
                                    DriverID: driver.DriverID,
                                    AdministratorID: result.Administrator.AdministratorID,
                                    BlockDate: request.body.BlockDate,
                                    Reason: request.body.Reason,
                                    Created: new Date()
                                };

                                BlockedDrivers.create(newBlockedDriver).then(() => {
                                    response.json({
                                        Message: "Driver account is blocked."
                                    });
                                });
                            }
                        });
                    }
                    else {
                        response.json({
                            Message: "Driver not found."
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
                Message: error.message,
            });
        }
    })(request, response);
});

module.exports = router;