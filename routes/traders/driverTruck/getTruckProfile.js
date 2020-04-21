const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Drivers = require("../../../models/drivers");
const Trucks = require("../../../models/trucks");
const Trailers = require("../../../models/trailers");

var router = express.Router();
router.use(cors());

// GET: getTruckProfile
router.get("/getTruckProfile", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                Drivers.findOne({
                    where: { DriverID: request.query.DriverID }
                }).then(async driver => {
                    if (driver) {
                        Trucks.findOne({
                            where: { DriverID: driver.DriverID }
                        }).then(async truck => {
                            if (truck) {
                                const trailers = await Trailers.findAll({
                                    where: { TruckID: truck.TruckID }
                                });

                                let truckProfile = {
                                    Truck: truck,
                                    Trailers: trailers
                                };

                                response.json({
                                    Message: "Truck profile found.",
                                    TruckProfile: truckProfile
                                });
                            }
                            else {
                                response.json({
                                    Messsage: "Truck not found."
                                });
                            }
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
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;