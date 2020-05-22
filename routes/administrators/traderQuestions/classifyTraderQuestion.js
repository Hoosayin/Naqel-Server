const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderQuestions = require("../../../models/traderQuestions");

var router = express.Router();
router.use(cors());

// POST: classifyTraderQuestion
router.post("/classifyTraderQuestion", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TraderQuestions.findOne({
                    where: { TraderQuestionID: request.body.TraderQuestionID }
                }).then(traderQuestion => {
                    if (traderQuestion) {
                        let updatedTraderQuestion = {
                            Class: request.body.Class
                        };

                        TraderQuestions.update(updatedTraderQuestion, { where: { TraderQuestionID: traderQuestion.TraderQuestionID } }).then(() => {
                            response.json({
                                Message: "Question is classified."
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Question not found."
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
                Message: error.message,
            });
        }
    })(request, response);
});

module.exports = router;