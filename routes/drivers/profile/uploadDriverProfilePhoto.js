const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverProfilePhotos = require("../../../models/driverProfilePhotos");

var router = express.Router();
router.use(cors());

// POST: uploadDriverProfilePhoto
router.post("/uploadDriverProfilePhoto", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverProfilePhotos.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(driverProfilePhoto => {
                    let newDriverProfilePhoto = {
                        DriverID: result.Driver.DriverID,
                        PhotoURL: request.body.PhotoURL,
                        DateUploaded: new Date(),
                        FileName: request.body.FileName
                    };

                    if (driverProfilePhoto) {
                        DriverProfilePhotos.update(newDriverProfilePhoto, { where: { DriverID: result.Driver.DriverID } }).then(() => {
                            response.json({
                                Message: "Profile photo is updated."
                            });
                        });
                    }
                    else {
                        DriverProfilePhotos.create(newDriverProfilePhoto).then(() => {
                            response.json({
                                Message: "Profile photo is added."
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
                Message: error.message,
            });
        }
    })(request, response);
});

module.exports = router;