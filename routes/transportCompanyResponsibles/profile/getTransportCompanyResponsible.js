const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");

var router = express.Router();
router.use(cors());

// GET: getTransportCompanyResponsible
router.get("/getTransportCompanyResponsible", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, result => {
        try {
            if (result.Message === "Transport company responsible found.") {
                response.json({
                    Message: "Transport company responsible found.",
                    TransportCompanyResponsible: result.TransportCompanyResponsible
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