const express = require("express");
const cors = require("cors");
const DriverProfilePhotos = require("../models/driverProfilePhotos");

var router = express.Router();
router.use(cors());

// POST: uploadDriverProfilePhoto
router.post("/uploadDriverProfilePhoto", (req, res) => {
    try {
        DriverProfilePhotos.findOne({
            where: { DriverID: req.body.DriverID },
        })
            .then(driverProfilePhoto => {

                let newDriverProfilePhoto = {
                    DriverID: req.body.DriverID,
                    URL: req.body.URL,
                    DateUploaded: new Date(),
                    FileName: req.body.FileName,
                };

                if (driverProfilePhoto) {
                    DriverProfilePhotos.update(newDriverProfilePhoto, { where: { DriverID: req.body.DriverID } })
                        .then(() => {
                            res.send("Driver's profile photo is updated.");
                        });
                }
                else {
                    DriverProfilePhotos.create(newDriverProfilePhoto)
                        .then(() => {
                            res.send("Driver's profile photo is added.");
                        });
                }

            });
    } catch (error) {
        return res.send(error);
    }
});

module.exports = router;