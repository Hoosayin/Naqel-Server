const express = require("express");
const cors = require("cors");
const TruckSizes = require("../../models/truckSizes");

var router = express.Router();
router.use(cors());

// GET: getTruckSizes
router.get("/getTruckSizes", (request, response) => {
    try {
        TruckSizes.findAll().then(truckSizes => {
            if (truckSizes) {
                response.json({
                    Message: "Truck sizes found.",
                    TruckSizes: truckSizes
                });
            }
            else {
                response.json({
                    Message: "Truck sizes not found."
                });
            }
        });
    } catch (error) {
        response.json({
            Message: error.message
        });
    }
});

module.exports = router;