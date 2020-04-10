const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const TraderRequests = require("../../../models/traderRequests");

var router = express.Router();
router.use(cors());

// POST: addTraderRequest
router.post("/addTraderRequest", (request, response) => {
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
                        response.json({
                            Message: "Trader request is already sent."
                        });
                    }
                    else {
                        let newTraderRequest = {
                            TraderID: result.Trader.TraderID,
                            JobRequestID: request.body.JobRequestID,
                            CargoType: request.body.CargoType,
                            CargoWeight: request.body.CargoWeight,
                            LoadingDate: request.body.LoadingDate,
                            LoadingTime: request.body.LoadingTime,
                            EntryExit: request.body.EntryExit,
                            AcceptedDelay: request.body.AcceptedDelay,
                            Created: new Date()
                        };

                        TraderRequests.create(newTraderRequest).then(() => {
                            response.json({
                                Message: "Trader request is added."
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