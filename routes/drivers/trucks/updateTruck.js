const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Trucks = require("../../../models/trucks");

var router = express.Router();
router.use(cors());

// POST: updateTruck
router.post("/updateTruck", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                Trucks.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(truck => {
                    if (truck) {
                        let updatedTruck = {
                            TransportCompanyResponsibleID: request.body.TransportCompanyResponsibleID,
                            PlateNumber: request.body.PlateNumber,
                            Owner: request.body.Owner,
                            ProductionYear: request.body.ProductionYear,
                            Brand: request.body.Brand,
                            Model: request.body.Model,
                            Type: request.body.Type,
                            Capacity: request.body.Capacity
                        };

                        Trucks.update(updatedTruck, { where: { TruckID: truck.TruckID } }).then(() => {
                            response.json({
                                Message: "Truck is updated."
                            });
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
                Message: error.message,
            });
        }
    })(request, response);
});



module.exports = router;