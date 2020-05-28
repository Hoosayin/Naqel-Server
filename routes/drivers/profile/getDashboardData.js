const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const BlockedDrivers = require("../../../models/blockedDrivers");

var router = express.Router();
router.use(cors());

// GET: getDashboardData
router.get("/getDashboardData", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                BlockedDrivers.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(blockedDriver => {
                    let driver = result.Driver.dataValues;

                    let dashboardData = {
                        IsActiveAccount: driver.Active,
                        BlockedUser: null
                    };

                    if (blockedDriver) {
                        const dateDifference = new Date(blockedDriver.BlockDate) - new Date();

                        if (dateDifference < 0) {
                            blockedDriver.destroy();
                        }
                        else {
                            let modifiableBlockedUser = blockedDriver.dataValues;
                            modifiableBlockedUser.FirstName = driver.FirstName;
                            modifiableBlockedUser.LastName = driver.LastName;

                            dashboardData.BlockedUser = modifiableBlockedUser;
                        }
                    }

                    response.json({
                        Message: "Dashboard data found.",
                        DashboardData: dashboardData
                    });
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