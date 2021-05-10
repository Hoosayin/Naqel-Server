const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverRequests = require("../../../models/driverRequests");

var router = express.Router();
router.use(cors());

// DELETE: denyDriverRequest
router.delete("/denyDriverRequest", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                DriverRequests.findOne({
                    where: { DriverRequestID: request.body.DriverRequestID }
                }).then(driverRequest => {
                    if (driverRequest) {
                        driverRequest.destroy();

                        response.json({
                            Message: "Driver request is denied."
                        });
                    }
                    else {
                        response.json({
                            Message: "Driver request not found."
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
                Message: error.Message,
            });
        }
    })(request, response);
});

module.exports = router;