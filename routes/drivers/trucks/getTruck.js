const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Trucks = require("../../../models/trucks");

var router = express.Router();
router.use(cors());

// GET: getTruck
router.get("/getTruck", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                Trucks.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(truck => {
                    if (truck) {
                        response.json({
                            Message: "Truck found.",
                            Truck: truck
                        });
                    }
                    else {
                        response.json({
                            Message: "Truck not found."
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