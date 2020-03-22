const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Traders = require("../../../models/traders");

var router = express.Router();
router.use(cors());

// POST: generalSettings
router.post("/generalSettings", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                let updatedTrader = {
                    FirstName: request.body.FirstName,
                    LastName: request.body.LastName,
                    Address: request.body.Address,
                    PhoneNumber: request.body.PhoneNumber,
                    Gender: request.body.Gender,
                    Nationality: request.body.Nationality,
                    DateOfBirth: request.body.DateOfBirth,
                }

                Traders.update(updatedTrader, { where: { TraderID: result.Trader.TraderID } }).then(() => {
                    response.json({
                        Message: "Trader is updated."
                    });
                });
            }
            else {
                response.json({
                    Message: "Trader not found."
                });
            }
        } catch (error) {
            response.json({
                Message: result.Message,
            });
        }
    })(request, response);
});

module.exports = router;