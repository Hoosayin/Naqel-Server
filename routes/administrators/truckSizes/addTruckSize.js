const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TruckSizes = require("../../../models/truckSizes");

var router = express.Router();
router.use(cors());

// POST: addTruckSizes
router.post("/addTruckSizes", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let newTruckSize = { 
                    TruckSize: request.body.TruckSize
                };

                TruckSizes.create(newTruckSize).then(() => {
                    response.json({
                        Message: "Truck size is added."
                    });
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