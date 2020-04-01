const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");

var router = express.Router();
router.use(cors());

// POST: generalSettings
router.post("/generalSettings", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                let updatedDriver = {
                    FirstName: request.body.FirstName,
                    LastName: request.body.LastName,
                    Address: request.body.Address,
                    PhoneNumber: request.body.PhoneNumber,
                    Gender: request.body.Gender,
                    Nationality: request.body.Nationality,
                    DateOfBirth: request.body.DateOfBirth
                };

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