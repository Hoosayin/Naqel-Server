const express = require("express");
const cors = require("cors");
const Traders = require("../../../models/traders");
const TraderProfilePhotos = require("../../../models/traderProfilePhotos");
const OnGoingJobs = require("../../../models/onGoingJobs");

var router = express.Router();
router.use(cors());

// GET: getTraderProfile
router.get("/getTraderProfile", (request, response) => {
    try {
        Traders.findOne({
            where: { TraderID: request.query.TraderID }
        }).then(trader => {
            if (trader) {
                TraderProfilePhotos.findOne({
                    where: { TraderID: trader.TraderID }
                }).then(async traderProfilePhoto => {
                    const onGoingJob = await OnGoingJobs.findOne({
                        where: { TraderID: trader.TraderID }
                    });

                    trader = trader.dataValues;
                    trader.PhotoURL = traderProfilePhoto ? traderProfilePhoto.PhotoURL : null;
                    trader.OnJob = onGoingJob ? true : false;

                    response.json({
                        Message: "Trader profile found.",
                        Trader: trader
                    });
                });
            }
            else {
                response.json({
                    Message: "Trader not found."
                });
            }
        });
    } catch (error) {
        response.json({
            Message: error.message
        });
    }
});

module.exports = router;