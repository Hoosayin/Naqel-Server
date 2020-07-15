const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Trucks = require("../../../models/trucks");
const Drivers = require("../../../models/drivers");
const DriverProfilePhotos = require("../../../models/DriverProfilePhotos");

var router = express.Router();
router.use(cors());

// GET: getTrucks
router.get("/getTrucks", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, (result) => {
        try {
            if (result.Message === "Transport company responsible found.") {
                Trucks.findAll({
                    attributes: ["TruckID", "DriverID", "TruckNumber", "Brand", "Model", "PhotoURL"],
                    where: { TransportCompanyResponsibleID: result.TransportCompanyResponsible.TransportCompanyResponsibleID }
                }).then(async trucks => {
                    if (trucks) {
                        let mutableTrucks = [];
                        let count = 0;

                        for (let truck of trucks) {
                            const driver = await Drivers.findOne({
                                attributes: ["FirstName", "LastName"],
                                where: { DriverID: truck.DriverID } 
                            });

                            const driverProfilePhoto = await DriverProfilePhotos.findOne({
                                attributes: ["PhotoURL"],
                                where: { DriverID: truck.DriverID } 
                            });

                            let mutableDriver = driver.dataValues;
                            mutableDriver.PhotoURL = driverProfilePhoto ? driverProfilePhoto.PhotoURL : null;

                            let mutableTruck = truck.dataValues;
                            mutableTruck.Driver = mutableDriver;

                            mutableTrucks[count++] = mutableTruck;
                        }

                        response.json({
                            Message: "Trucks found.",
                            Trucks: mutableTrucks
                        });
                    }
                    else {
                        response.json({
                            Message: "Trucks not found."
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