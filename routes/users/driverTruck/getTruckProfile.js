const express = require("express");
const cors = require("cors");
const Drivers = require("../../../models/drivers");
const Trucks = require("../../../models/trucks");
const Trailers = require("../../../models/trailers");

var router = express.Router();
router.use(cors());

// GET: getTruckProfile
router.get("/getTruckProfile", (request, response) => {
    try {
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
    } catch (error) {
        response.json({
            Message: error.message
        });
    }
});

module.exports = router;