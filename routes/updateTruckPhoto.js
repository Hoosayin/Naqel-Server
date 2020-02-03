const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Trucks = require("../models/trucks");
const tokenGenerator = require("../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: updateTruckPhoto
router.post("/dashboard/updateTruckPhoto", (req, res) => {
    try {
        let driverToken = jwtDecode(req.body.Token);

        Trucks.findOne({
            where: { DriverID: driverToken.DriverID }
        }).then(truck => {
            if (truck) {
                let updatedTruck = {
                    PhotoURL: req.body.PhotoURL
                };

                Trucks.update(updatedTruck, { where: { TruckID: truck.TruckID } }).then(() => {
                    console.log("Truck is updated in database.");
                    tokenGenerator.generateDriverToken(driverToken.DriverID, token => {
                        res.json({
                            Message: "Truck photo updated.",
                            Token: token
                        });
                    });
                });
            }
            else {
                res.json({
                    Message: "Truck not found.",
                    Token: token
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