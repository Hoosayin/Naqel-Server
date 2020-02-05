const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../models/drivers");
const Trucks = require("../models/trucks");
const Trailers = require("../models/trailers");
const tokenGenerator = require("../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: addTrailer
router.post("/dashboard/addTrailer", (req, res) => {
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
                        Trailers.findAndCountAll({
                            where: { TruckID: truck.TruckID },
                        }).then(trailers => {
                            console.log(trailers);
                            if (trailers.count < 2) {
                                let newTrailer = {
                                    TruckID: truck.TruckID,
                                    MaximumWeight: req.body.MaximumWeight,
                                    PhotoURL: req.body.PhotoURL,
                                    Type: req.body.Type
                                };

                                Trailers.create(newTrailer).then(() => {
                                    tokenGenerator.generateDriverToken(driver.DriverID, token => {
                                        res.json({
                                            Message: "Trailer is added.",
                                            Token: token
                                        });
                                    })
                                });
                            }
                            else {
                                res.json({
                                    Message: "You cannot add trailers to this truck anymore."
                                });
                            }
                        });
                    }
                    else {
                        res.json({
                            Message: "Truck not found."
                        });
                    }
                })
            }
        });
    } catch (error) {
        return res.json({
            Message: error
        });
    }
});

module.exports = router;