const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Trucks = require("../../../models/trucks");

var router = express.Router();
router.use(cors());

// GET: getTrucks
router.get("/getTrucks", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, (result) => {
        try {
            if (result.Message === "Transport company responsible found.") {
                Trucks.findAll({
                    attributes: ["TruckID", "DriverID", "Brand", "Model"],
                    where: { TransportCompanyResponsibleID: result.TransportCompanyResponsible.TransportCompanyResponsibleID }
                }).then(trucks => {
                    if (trucks) {
                        response.json({
                            Message: "Trucks found.",
                            Trucks: trucks
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