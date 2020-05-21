const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");
const BlockedDrivers = require("../../../models/blockedDrivers");

var router = express.Router();
router.use(cors());

// POST: unblockDriverAccount
router.post("/unblockDriverAccount", (request, response) => {
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
                                blockedDriver.destroy();

                                response.json({
                                    Message: "Driver account is unblocked."
                                });
                            }
                            else {
                                response.json({
                                    Message: "Driver account is not blocked."
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