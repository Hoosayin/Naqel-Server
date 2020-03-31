const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");

var router = express.Router();
router.use(cors());

// GET: getDriver
router.get("/getDriver", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                response.json({
                    Message: "Driver found.",
                    Driver: result.Driver
                });
            }
            else {
                response.json({
                    Message: result.Message
                });
            }
        } catch (error) {
            response.json({
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;