const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const passport = require("../../../helpers/passportHelper");

const stripe = new Stripe("sk_test_RVhdSfOgg0jQHCYLYH8Z05JM00bkPnPBVg");

var router = express.Router();
router.use(cors());

// POST: getClientSecret
router.post("/getClientSecret", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, async result => {
        try {
            if (result.Message === "Trader found.") {
                const amount = request.body.Amount;

                const paymentIntent = await stripe.paymentIntents.create({
                    amount,
                    currency: "usd"
                });

                response.json({
                    Message: "Client secret found.",
                    ClientSecret: paymentIntent.client_secret
                });
            }
            else {
                response.json({
                    Message: result.Message
                });
            }
        } catch (error) {
            response.json({
                Message: error.message,
            });
        }
    })(request, response);
});

module.exports = router;