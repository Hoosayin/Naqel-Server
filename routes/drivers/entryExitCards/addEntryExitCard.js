const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverEntryExitCards = require("../../../models/driverEntryExitCards");

var router = express.Router();
router.use(cors());

// POST: addEntryExitCard
router.post("/addEntryExitCard", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverEntryExitCards.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(driverEntryExitCard => {
                    if (driverEntryExitCard) {
                        response.json({
                            Message: "Entry/Exit card already exists."
                        });
                    }
                    else {
                        let newEntryExitCard = {
                            DriverID: result.Driver.DriverID,
                            EntryExitNumber: request.body.EntryExitNumber,
                            Type: request.body.Type,
                            ReleaseDate: request.body.ReleaseDate,
                            NumberOfMonths: request.body.NumberOfMonths
                        };

                        DriverEntryExitCards.create(newEntryExitCard).then(() => {
                            response.json({
                                Message: "Entry/Exit card is added."
                            });
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