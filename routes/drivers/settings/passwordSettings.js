const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Drivers = require("../../../models/drivers");
const passport = require("../../../helpers/passportHelper");

const BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();
router.use(cors());

// POST: passwordSettings
router.post("/passwordSettings", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                bcrypt.hash(request.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                    let updatedDriver = {
                        Password: passwordHash,
                    };

                    Drivers.update(updatedDriver, { where: { DriverID: result.Driver.DriverID } }).then(() => {
                        response.json({
                            Message: "Driver is updated."
                        });
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