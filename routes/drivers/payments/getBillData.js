const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");

var router = express.Router();
router.use(cors());

// GET: getBillData
router.get("/getBillData", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, async result => {
        try {
            if (result.Message === "Driver found.") {

                let driver = result.Driver;

                let billData = {
                    FirstName: driver.FirstName,
                    LastName: driver.LastName,
                    Address: driver.Address
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