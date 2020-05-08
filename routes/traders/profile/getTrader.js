const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");

var router = express.Router();
router.use(cors());

// GET: getTrader
router.get("/getTrader", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, async result => {
        try {
            if (result.Message === "Trader found.") {
                const profilePhoto = await TraderProfilePhotos.findOne({
                    where: { TraderID: result.Trader.TraderID }
                });

                let trader = result.Trader.dataValues;
                trader.PhotoURL = profilePhoto ? profilePhoto.PhotoURL : null;

                response.json({
                    Message: "Trader found.",
                    Trader: trader
                });
            }
            else {
                response.json({
                    Message: "Trader not found."
                });
            }
        } catch (error) {
            response.json({
                Message: "Trader not found.",
            });
        }
    })(request, response);
});

module.exports = router;