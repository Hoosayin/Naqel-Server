const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TruckTypes = require("../../../models/truckTypes");

var router = express.Router();
router.use(cors());

// POST: deleteTruckType
router.delete("/deleteTruckType", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TruckTypes.findOne({
                    where: { TruckTypeID: request.body.TruckTypeID }
                }).then(truckType => {
                    if (truckType) {
                        truckType.destroy();

                        response.json({
                            Message: "Truck type is deleted."
                        });
                    }
                    else {
                        response.json({
                            Message: "Truck type not found."
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