const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");

var router = express.Router();
router.use(cors());

// POST: activateDriverAccount
router.post("/activateDriverAccount", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                Drivers.findOne({
                    where: { DriverID: request.body.DriverID }
                }).then(driver => {
                    if (driver) {
                        let updatedDriver = {
                            Active: true
                        };

                        Drivers.update(updatedDriver, { where: { DriverID: driver.DriverID } }).then(() => {
                            response.json({
                                Message: "Driver account is activated."
                            });
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