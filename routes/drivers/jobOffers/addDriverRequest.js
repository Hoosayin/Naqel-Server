const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const DriverRequests = require("../../../models/driverRequests");

var router = express.Router();
router.use(cors());

// POST: addDriverRequest
router.post("/addDriverRequest", (request, response) => {
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
                        response.json({
                            Message: "Driver request is already sent."
                        });
                    }
                    else {
                        let newDriverRequest = {
                            DriverID: result.Driver.DriverID,
                            JobOfferID: request.body.JobOfferID,
                            Price: request.body.Price,
                            Created: new Date()
                        };

                        DriverRequests.create(newDriverRequest).then(() => {
                            response.json({
                                Message: "Driver request is added."
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
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;