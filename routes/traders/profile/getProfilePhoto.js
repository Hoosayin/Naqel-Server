const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");

var router = express.Router();
router.use(cors());

// GET: getProfilePhoto
router.get("/getProfilePhoto", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                TraderProfilePhotos.findOne({
                    where: { TraderID: result.Trader.TraderID }
                }).then(traderProfilePhoto => {
                    if (traderProfilePhoto) {
                        response.json({
                            Message: "Profile photo found.",
                            ProfilePhoto: traderProfilePhoto
                        });
                    }
                    else {
                        response.json({
                            Message: "Profile photo not found."
                        });
                    }
                });
            }
            else {
                response.json({
                    Message: "Trader not found."
                });
            }
        } catch (error) {
            response.json({
                Message: result.Message ,
            });
        }
    })(request, response);
});

module.exports = router;