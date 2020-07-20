const express = require("express");
const cors = require("cors");
const TruckTypes = require("../../models/truckTypes");

var router = express.Router();
router.use(cors());

// GET: getTruckTypes
router.get("/getTruckTypes", (request, response) => {
    try {
        TruckTypes.findAll().then(truckTypes => {
            if (truckTypes) {
                response.json({
                    Message: "Truck types found.",
                    TruckTypes: truckTypes
                });
            }
            else {
                response.json({
                    Message: "Truck types not found."
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