const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderQuestions = require("../../../models/traderQuestions");
const TraderAnswers = require("../../../models/traderAnswers");

var router = express.Router();
router.use(cors());

// POST: deleteQuestion
router.delete("/deleteQuestion", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                TraderQuestions.findOne({
                    where: { TraderQuestionID: request.body.TraderQuestionID }
                }).then(traderQuestion => {
                    if (traderQuestion) {
                        TraderAnswers.destroy({
                            where: { TraderQuestionID: traderQuestion.TraderQuestionID }
                        }).then(() => {
                            traderQuestion.destroy();

                            response.json({
                                Message: "Question is deleted."
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
                Message: error.message
            });
        }
    })(request, response);
});
module.exports = router;