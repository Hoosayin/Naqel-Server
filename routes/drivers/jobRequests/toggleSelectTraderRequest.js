const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderRequests = require("../../../models/traderRequests");

var router = express.Router();
router.use(cors());

// POST: toggleSelectTraderRequest
router.post("/toggleSelectTraderRequest", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                TraderRequests.findOne({
                    where: { TraderRequestID: request.body.TraderRequestID }
                }).then(traderRequest => {
                    if (traderRequest) {
                        let updatedTraderRequest = {
                            Selected: traderRequest.Selected ? false : true
                        };

                        TraderRequests.update(updatedTraderRequest, { where: { TraderRequestID: traderRequest.TraderRequestID } }).then(() => {
                            response.json({
                                Message: "Trader request is toggled."
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Trader request not found."
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