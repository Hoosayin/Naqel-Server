const express = require("express");
const cors = require("cors");
const passport = require("../../../../helpers/passportHelper");
const Trucks = require("../../../../models/trucks");
const Trailers = require("../../../../models/trailers");

var router = express.Router();
router.use(cors());

// POST: addTrailer
router.post("/addTrailer", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                Trucks.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(truck => {
                    if (truck) {
                        Trailers.findAndCountAll({
                            where: { TruckID: truck.TruckID }
                        }).then(trailers => {
                            if (trailers.count < 2) {
                                let newTrailer = {
                                    TruckID: truck.TruckID,
                                    Capacity: request.body.Capacity,
                                    PhotoURL: request.body.PhotoURL,
                                    Type: request.body.Type
                                };

                                Trailers.create(newTrailer).then(() => {
                                    response.json({
                                        Message: "Trailer is added."
                                    });
                                });
                            }
                            else {
                                response.json({
                                    Message: "You cannot add trailers to this truck anymore."
                                });
                            }
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