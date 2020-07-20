const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TruckSizes = require("../../../models/truckSizes");

var router = express.Router();
router.use(cors());

// POST: deleteTruckSize
router.delete("/deleteTruckSize", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TruckSizes.findOne({
                    where: { TruckSizeID: request.body.TruckSizeID }
                }).then(truckSize => {
                    if (truckSize) {
                        truckSize.destroy();

                        response.json({
                            Message: "Truck size is deleted."
                        });
                    }
                    else {
                        response.json({
                            Message: "Truck size not found."
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