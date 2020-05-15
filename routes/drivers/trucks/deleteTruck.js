const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Trucks = require("../../../models/trucks");
const Trailers = require("../../../models/trailers");

var router = express.Router();
router.use(cors());

// DELETE: deleteTruck
router.delete("/deleteTruck", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                Trucks.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(truck => {
                    if (truck) {
                        Trailers.destroy({
                            where: { TruckID: truck.TruckID }
                        }).then(() => {
                            truck.destroy();

                            response.json({
                                Message: "Truck is deleted."
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