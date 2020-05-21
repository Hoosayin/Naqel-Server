const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");

var router = express.Router();
router.use(cors());

// POST: accountSetup
router.post("/setupAccount", (request, response) => {
    passport.authenticate("SetupAdministratorAccount", result => {
        try {
            response.json({
                Message: result.Message
            });
        } catch (error) {
            response.json({
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;