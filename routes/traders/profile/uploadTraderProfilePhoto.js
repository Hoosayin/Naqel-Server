const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");


var router = express.Router();
router.use(cors());

// POST: uploadTraderProfilePhoto
router.post("/uploadTraderProfilePhoto", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                TraderProfilePhotos.findOne({
                    where: { TraderID: result.Trader.TraderID }
                }).then(traderProfilePhoto => {
                    let newTraderProfilePhoto = {
                        TraderID: result.Trader.TraderID,
                        PhotoURL: request.body.PhotoURL,
                        DateUploaded: new Date(),
                        FileName: request.body.FileName
                    };

                    if (traderProfilePhoto) {
                        TraderProfilePhotos.update(newTraderProfilePhoto, { where: { TraderID: result.Trader.TraderID } }).then(() => {
                            response.json({
                                Message: "Profile photo is updated."
                            });
                        });
                    }
                    else {
                        TraderProfilePhotos.create(newTraderProfilePhoto).then(() => {
                            response.json({
                                Message: "Profile photo is added."
                            });
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
                Message: result.Message,
            });
        }
    })(request, response);
});

module.exports = router;