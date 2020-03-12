const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../models/drivers");
const DriverProfilePhotos = require("../models/driverProfilePhotos");
const tokenGenerator = require("../helpers/tokenGenerator");


var router = express.Router();
router.use(cors());

// POST: uploadDriverProfilePhoto
router.post("/uploadDriverProfilePhoto", (req, res) => {
    try {
        let driverToken = jwtDecode(req.body.Token);

        Drivers.findOne({
            where: { DriverID: driverToken.DriverID },
        }).then(driver => {
            if (!driver) {
                res.json({
                    Message: "Driver not found."
                });
            }
            else {
                DriverProfilePhotos.findOne({
                    where: { DriverID: driver.DriverID },
                }).then(driverProfilePhoto => {

                    let newDriverProfilePhoto = {
                        DriverID: driver.DriverID,
                        URL: req.body.URL,
                        DateUploaded: new Date(),
                        FileName: req.body.FileName,
                    };

                    console.log(newDriverProfilePhoto);

                    if (driverProfilePhoto) {
                        DriverProfilePhotos.update(newDriverProfilePhoto, { where: { DriverID: driver.DriverID } }).then(() => {
                            tokenGenerator.generateDriverToken(driver.DriverID, token => {
                                res.json({
                                    Message: "Driver's profile photo is updated.",
                                    Token: token
                                });
                            });
                        });
                    }
                    else {
                        DriverProfilePhotos.create(newDriverProfilePhoto).then(() => {
                            tokenGenerator.generateDriverToken(driver.DriverID, token => {
                                res.json({
                                    Message: "Driver's profile photo is added.",
                                    Token: token
                                });
                            });
                        });
                    }

                });
            }
        });
    } catch (error) {
        return res.json({
            Message: error
        });
    }
});

module.exports = router;