const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const DriverObjectionReasons = require("../../../models/driverObjectionReasons");

var router = express.Router();
router.use(cors());

// GET: getObjectionReasons
router.get("/getObjectionReasons", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, async result => {
        try {
            if (result.Message === "Driver found.") {
                DriverObjectionReasons.findAll({
                    where: {
                        [Op.or]: [
                            { DriverID: null },
                            { DriverID: result.Driver.DriverID }
                        ]
                    }
                }).then(driverObjectionReasons => {
                    if (driverObjectionReasons) {
                        response.json({
                            Message: "Objection reasons found.",
                            ObjectionReasons: driverObjectionReasons,
                        });
                    }
                    else {
                        response.json({
                            Message: "Objection reasons not found."
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