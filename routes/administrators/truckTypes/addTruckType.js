const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TruckTypes = require("../../../models/truckTypes");

var router = express.Router();
router.use(cors());

// POST: addTruckType
router.post("/addTruckType", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let newTruckType = { 
                    TruckType: request.body.TruckType
                };

                TruckTypes.create(newTruckType).then(() => {
                    response.json({
                        Message: "Truck type is added."
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