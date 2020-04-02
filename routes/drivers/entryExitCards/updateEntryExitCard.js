const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverEntryExitCards = require("../../../models/driverEntryExitCards");;

var router = express.Router();
router.use(cors());

// POST: updateEntryExitCard
router.post("/updateEntryExitCard", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverEntryExitCards.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(driverEntryExitCard => {
                    if (driverEntryExitCard) {
                        let updatedEntryExitCard = {
                            EntryExitNumber: request.body.EntryExitNumber,
                            Type: request.body.Type,
                            ReleaseDate: request.body.ReleaseDate,
                            NumberOfMonths: request.body.NumberOfMonths,
                        };

                        DriverEntryExitCards.update(updatedEntryExitCard, { where: { EntryExitCardID: driverEntryExitCard.EntryExitCardID } }).then(() => {
                            response.json({
                                Message: "Entry/Exit card is updated."
                            });
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