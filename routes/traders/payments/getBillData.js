const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");

var router = express.Router();
router.use(cors());

// GET: getBillData
router.get("/getBillData", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, async result => {
        try {
            if (result.Message === "Trader found.") {

                let trader = result.Trader;

                let billData = {
                    FirstName: trader.FirstName,
                    LastName: trader.LastName,
                    Type: trader.Type,
                    Address: trader.Address
                };

                response.json({
                    Message: "Bill data found.",
                    BillData: billData
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