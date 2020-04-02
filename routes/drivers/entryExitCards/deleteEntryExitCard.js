const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverEntryExitCards = require("../../../models/driverEntryExitCards");

var router = express.Router();
router.use(cors());

// POST: deleteEntryExitCard
router.delete("/deleteEntryExitCard", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverEntryExitCards.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(driverEntryExitCard => {
                    if (driverEntryExitCard) {
                        driverEntryExitCard.destroy();

                        response.json({
                            Message: "Entry/Exit card is deleted."
                        });
                    }
                    else {
                        response.json({
                            Message: "Entry/Exit card not found."
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