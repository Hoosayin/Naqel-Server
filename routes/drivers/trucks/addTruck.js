const express = require("express");
const cors = require("cors");
const uuid = require("uuid-v4");
const passport = require("../../../helpers/passportHelper");
const Trucks = require("../../../models/trucks");

var router = express.Router();
router.use(cors());

// POST: addTruck
router.post("/addTruck", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                Trucks.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(truck => {
                    if (truck) {
                        response.json({
                            Message: "Truck already found."
                        });
                    }
                    else {
                        let newTruck = {
                            DriverID: result.Driver.DriverID,
                            TransportCompanyResponsibleID: request.body.TransportCompanyResponsibleID,
                            TruckNumber: uuid().substring(0, 8).toUpperCase(),
                            PlateNumber: request.body.PlateNumber,
                            Owner: request.body.Owner,
                            ProductionYear: request.body.ProductionYear,
                            Brand: request.body.Brand,
                            Model: request.body.Model,
                            Type: request.body.Type,
                            MaximumWeight: request.body.MaximumWeight,
                            PhotoURL: request.body.PhotoURL
                        };

                        Trucks.create(newTruck).then(() => {
                            response.json({
                                Message: "Truck is added."
                            });
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