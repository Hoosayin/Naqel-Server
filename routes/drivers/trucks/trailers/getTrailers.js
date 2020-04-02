const express = require("express");
const cors = require("cors");
const passport = require("../../../../helpers/passportHelper");
const Trucks = require("../../../../models/trucks");
const Trailers = require("../../../../models/trailers");

var router = express.Router();
router.use(cors());

// GET: getTrailers
router.get("/getTrailers", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                Trucks.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(truck => {
                    if (truck) {
                        Trailers.findAll({
                            where: { TruckID: truck.TruckID }
                        }).then(trailers => {
                            if (trailers) {
                                for (trailer in trailers) {
                                    trailer = trailer.dataValues;
                                }

                                response.json({
                                    Message: "Trailers found.",
                                    Trailers: trailers
                                });
                            }
                            else {
                                response.json({
                                    Message: "Trailers not found."
                                });
                            }
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