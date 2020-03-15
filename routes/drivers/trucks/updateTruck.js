const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Trucks = require("../../../models/trucks");
const tokenGenerator = require("../../../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: updateTruck
router.post("/updateTruck", (req, res) => {
    try {
        let driverToken = jwtDecode(req.body.Token);

        Trucks.findOne({
            where: { DriverID: driverToken.DriverID }
        }).then(truck => {
            if (truck) {
                let updatedTruck = {
                    PlateNumber: req.body.PlateNumber,
                    Owner: req.body.Owner,
                    ProductionYear: req.body.ProductionYear,
                    Brand: req.body.Brand,
                    Model: req.body.Model,
                    Type: req.body.Type,
                    MaximumWeight: req.body.MaximumWeight
                };

                Trucks.update(updatedTruck, { where: { TruckID: truck.TruckID } }).then(() => {
                    console.log("Truck is updated in database.");
                    tokenGenerator.generateDriverToken(driverToken.DriverID, token => {
                        res.json({
                            Message: "Truck is updated in database.",
                            Token: token
                        });
                    });
                });
            }
            else {
                res.json({
                    Message: "Truck not found."
                });
            }
        });
    } catch (error) {
        return res.json({
            Message: error
        });
    }
});

module.exports = router;