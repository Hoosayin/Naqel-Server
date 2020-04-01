const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");

var router = express.Router();
router.use(cors());

// POST: usernameAndEmailSettings
router.post("/usernameAndEmailSettings", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                let updatedDriver = {
                    Username: request.body.Username,
                    Email: request.body.Email,
                }

                Drivers.update(updatedDriver, { where: { DriverID: result.Driver.DriverID } }).then(() => {
                    response.json({
                        Message: "Driver is updated."
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
                Message: error.message,
            });
        }
    })(request, response);
});

module.exports = router;