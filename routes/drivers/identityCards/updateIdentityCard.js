const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverIdentityCards = require("../../../models/driverIdentityCards");

var router = express.Router();
router.use(cors());

// POST: updateIdentityCard
router.post("/updateIdentityCard", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverIdentityCards.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(driverIdentityCard => {
                    if (driverIdentityCard) {
                        let updatedIdentityCard = {
                            IDNumber: request.body.IDNumber,
                            PhotoURL: request.body.PhotoURL
                        };

                        DriverIdentityCards.update(updatedIdentityCard, { where: { IdentityCardID: driverIdentityCard.IdentityCardID } }).then(() => {
                            response.json({
                                Message: "Identity card is updated."
                            });
                        });

                    }
                    else {
                        response.json({
                            Message: "Identity card not found."
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