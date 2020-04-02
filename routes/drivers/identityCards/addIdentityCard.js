const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverIdentityCards = require("../../../models/driverIdentityCards");

var router = express.Router();
router.use(cors());

// POST: addIdentityCard
router.post("/addIdentityCard", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverIdentityCards.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(driverIdentityCard => {
                    if (driverIdentityCard) {
                        response.json({
                            Message: "Identity card already exists."
                        });
                    }
                    else {
                        let newIdentityCard = {
                            DriverID: result.Driver.DriverID,
                            IDNumber: request.body.IDNumber,
                            PhotoURL: request.body.PhotoURL,
                            Created: new Date()
                        };

                        DriverIdentityCards.create(newIdentityCard).then(() => {
                            response.json({
                                Message: "Identity card is added."
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
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;