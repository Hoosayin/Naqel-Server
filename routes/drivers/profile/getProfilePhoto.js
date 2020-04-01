const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverProfilePhotos = require("../../../models/driverProfilePhotos");

var router = express.Router();
router.use(cors());

// GET: getProfilePhoto
router.get("/getProfilePhoto", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverProfilePhotos.findOne({
                    where: { DriverID: result.Driver.DriverID }
                }).then(driverProfilePhoto => {
                    if (driverProfilePhoto) {
                        response.json({
                            Message: "Profile photo found.",
                            ProfilePhoto: driverProfilePhoto
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