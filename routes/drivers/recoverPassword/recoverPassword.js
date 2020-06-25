const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Drivers = require("../../../models/drivers");

const BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();
router.use(cors());

// POST: recoverPassword
router.post("/recoverPassword", (request, response) => {
    Drivers.findOne({
        where: { PhoneNumber: request.body.PhoneNumber }
    }).then(driver => {
        if (driver) {
            bcrypt.hash(request.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                let updatedDriver = {
                    Password: passwordHash,
                };

                Drivers.update(updatedDriver, { where: { DriverID: driver.DriverID } }).then(() => {
                    response.json({
                        Message: "Phone number is updated."
                    });
                });
            });
        }
        else {
            response.json({
                Message: "Driver not found."
            });
        }
    }).catch(error => {
        response.json({
            Message: error.message
        })
    });
});

module.exports = router;