const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const ExoneratedTraders = require("../../../models/exoneratedTraders");

var router = express.Router();
router.use(cors());

// GET: getDashboardData
router.get("/getDashboardData", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                ExoneratedTraders.findOne({
                    where: { TraderID: result.Trader.TraderID }
                }).then(exoneratedTrader => {
                    let trader = result.Trader;

                    let dashboardData = {
                        BlockedUser: null
                    };

                    if (exoneratedTrader) {
                        const dateDifference = new Date(exoneratedTrader.ExonerateDate) - new Date();

                        if (dateDifference < 0) {
                            exoneratedTrader.destroy();
                        }
                        else {
                            let modifiableExoneratedTrader = exoneratedTrader.dataValues;
                            modifiableExoneratedTrader.FirstName = trader.FirstName;
                            modifiableExoneratedTrader.LastName = trader.LastName;
                            dashboardData.ExoneratedTrader = modifiableExoneratedTrader;
                        }
                    }

                    response.json({
                        Message: "Dashboard data found.",
                        DashboardData: dashboardData
                    });
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