const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const TraderRequests = require("../../../models/traderRequests");

var router = express.Router();
router.use(cors());

// DELETE: deleteTraderRequest
router.delete("/deleteTraderRequest", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                TraderRequests.findOne({
                    where: {
                        [Op.and]: [
                            { JobRequestID: request.body.JobRequestID },
                            { TraderID: result.Trader.TraderID  }
                        ]
                    }
                }).then(traderRequest => {
                    if (traderRequest) {
                        traderRequest.destroy();

                        response.json({
                            Message: "Trader request is deleted."
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