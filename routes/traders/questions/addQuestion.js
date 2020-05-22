const express = require("express");
const cors = require("cors");
const uuid = require("uuid-v4");
const passport = require("../../../helpers/passportHelper");
const TraderQuestions = require("../../../models/traderQuestions");

var router = express.Router();
router.use(cors());

// POST: addQuestion
router.post("/addQuestion", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                let newTraderQuestion = {
                    TraderID: result.Trader.TraderID,
                    QuestionNumber: uuid().substring(0, 8).toUpperCase(),
                    Question: request.body.Question,
                    Class: null,
                    Created: new Date()
                };

                TraderQuestions.create(newTraderQuestion).then(() => {
                    response.json({
                        Message: "Question is added."
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