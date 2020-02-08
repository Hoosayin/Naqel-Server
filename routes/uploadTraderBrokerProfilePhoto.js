const express = require("express");
const cors = require("cors");
const TraderBrokerProfilePhoto = require("../models/TProfilePhoto");

var router = express.Router();
router.use(cors());

// POST: uploadDriverProfilePhoto
router.post("/uploadTraderBrokerProfilePhoto", (req, res) => {
    try {
        TraderBrokerProfilePhoto.findOne({
            where: { TraderID: req.body.TraderID },
        })
            .then(traderProfilePhoto => {

                let newtraderprofilePhoto = {
                    TraderID: req.body.TraderID,
                    URL: req.body.URL,
                    DateUploaded: new Date(),
                    FileName: req.body.FileName,
                };

                if (traderProfilePhoto) {
                    TraderBrokerProfilePhoto.update(newtraderprofilePhoto, { where: { TraderID: req.body.TraderID } })
                        .then(() => {
                            res.send("Trader/Broker profile photo is updated.");
                        });
                }
                else {
                    TraderBrokerProfilePhoto.create(newtraderprofilePhoto)
                        .then(() => {
                            res.send("Trader/Broker profile photo is added.");
                        });
                }

            });
    } catch (error) {
        return res.send(error);
    }
});

module.exports = router;