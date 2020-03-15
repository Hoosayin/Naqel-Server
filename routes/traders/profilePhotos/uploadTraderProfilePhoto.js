const express = require("express");
const cors = require("cors");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");

var router = express.Router();
router.use(cors());

// POST: uploadTraderProfilePhoto
router.post("/uploadTraderProfilePhoto", (req, res) => {
    try {
        TraderProfilePhotos.findOne({
            where: { TraderID: req.body.TraderID },
        }).then(traderProfilePhoto => {

            let newTraderProfilePhoto = {
                TraderID: req.body.TraderID,
                URL: req.body.URL,
                DateUploaded: new Date(),
                FileName: req.body.FileName,
            };

            if (traderProfilePhoto) {
                TraderProfilePhotos.update(newTraderProfilePhoto, { where: { TraderID: req.body.TraderID } }).then(() => {
                    res.send("Trader/Broker profile photo is updated.");
                });
            }
            else {
                TraderBrokerProfilePhotos.create(newTraderProfilePhoto).then(() => {
                    res.send("Trader/Broker profile photo is added.");
                });
            }

        });
    } catch (error) {
        return res.send(error);
    }
});

module.exports = router;