const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const passport = require("../../../helpers/passportHelper");
const TraderObjectionReasons = require("../../../models/traderObjectionReasons");

var router = express.Router();
router.use(cors());

// GET: getObjectionReasons
router.get("/getObjectionReasons", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, async result => {
        try {
            if (result.Message === "Trader found.") {
                TraderObjectionReasons.findAll({
                    where: {
                        [Op.or]: [
                            { TraderID: null },
                            { TraderID: result.Trader.TraderID }
                        ]
                    }
                }).then(traderObjectionReasons => {
                    if (traderObjectionReasons) {
                        response.json({
                            Message: "Objection reasons found.",
                            ObjectionReasons: traderObjectionReasons,
                        });
                    }
                    else {
                        response.json({
                            Message: "Objection reasons not found."
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