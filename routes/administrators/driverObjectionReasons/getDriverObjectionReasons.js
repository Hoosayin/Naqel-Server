const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverObjectionReasons = require("../../../models/driverObjectionReasons");

var router = express.Router();
router.use(cors());

// GET: getDriverObjectionReasons
router.get("/getDriverObjectionReasons", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                DriverObjectionReasons.findAll().then(driverObjectionReasons => {
                    if (driverObjectionReasons) {
                        response.json({
                            Message: "Driver objection reasons found.",
                            ObjectionReasons: driverObjectionReasons
                        });
                    }
                    else {
                        response.json({
                            Message: "Driver objection reasons not found."
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