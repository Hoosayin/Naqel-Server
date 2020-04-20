const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const DriverRequests = require("../../../models/driverRequests");

var router = express.Router();
router.use(cors());

// DELETE: deleteDriverRequest
router.delete("/deleteDriverRequest", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverRequests.findOne({
                    where: {
                        [Op.and]: [
                            { JobOfferID: request.body.JobOfferID },
                            { DriverID: result.Driver.DriverID  }
                        ]
                    }
                }).then(driverRequest => {
                    if (driverRequest) {
                        driverRequest.destroy();

                        response.json({
                            Message: "Driver request is deleted."
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