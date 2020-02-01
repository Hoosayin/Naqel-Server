const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../models/drivers");
const Trucks = require("../models/trucks");

var router = express.Router();
router.use(cors());

// POST: addTruck
router.post("/dashboard/addTruck", (req, res) => {
    try {
        let driverToken = jwtDecode(req.body.Token);

        Drivers.findOne({
            where: { DriverID: driverToken.DriverID },
        }).then(driver => {
            if (!driver) {
                res.send("Driver not found.");
            }
            else {
                Trucks.findOne({
                    where: { DriverID: driver.DriverID }
                }).then(truck => {
                    if (truck) {
                        res.send("Driver already has a truck.");
                    }
                    else {
                        let newTruck = {
                            DriverID: driver.DriverID,
                            TransportCompanyID: 1,
                            PlateNumber: req.body.PlateNumber,
                            Owner: req.body.Owner,
                            ProductionYear: req.body.ProductionYear,
                            Brand: req.body.Brand,
                            Model: req.body.Model,
                            Type: req.body.Type,
                            MaximumWeight: req.body.MaximumWeight,
                            PhotoURL: req.body.MaximumWeight,
                        };

                        Trucks.create(newTruck).then(() => {
                            res.send("Driver's truck is added.");
                        });
                    }
                })
            }
        });
    } catch (error) {
        return res.send(error);
    }
});

module.exports = router;