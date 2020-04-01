const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Trucks = require("../../../models/trucks");

var router = express.Router();
router.use(cors());

// POST: updateTruckPhoto
router.post("/updateTruckPhoto", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                Trucks.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(truck => {
                    if (truck) {
                        let updatedTruck = {
                            PhotoURL: request.body.PhotoURL
                        };

                        Trucks.update(updatedTruck, { where: { TruckID: truck.TruckID } }).then(() => {
                            response.json({
                                Message: "Truck photo updated."
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