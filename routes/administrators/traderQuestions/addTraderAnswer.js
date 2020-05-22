const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderQuestions = require("../../../models/traderQuestions");
const TraderAnswers = require("../../../models/traderAnswers");

var router = express.Router();
router.use(cors());

// POST: addTraderObjectionReason
router.post("/addTraderAnswer", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TraderQuestions.findOne({
                    where: { TraderQuestionID: request.body.TraderQuestionID }
                }).then(traderQuestion => {
                    if (traderQuestion) {
                        TraderAnswers.findOne({
                            where: { TraderQuestionID: traderQuestion.TraderQuestionID }
                        }).then(traderAnswer => {
                            if (traderAnswer) {
                                let updatedTraderAnswer = {
                                    AdministratorID: result.Administrator.AdministratorID,
                                    Answer: request.body.Answer,
                                    Edited: true,
                                    Created: new Date()
                                };

                                TraderAnswers.update(updatedTraderAnswer, { where: { TraderAnswerID: traderAnswer.TraderAnswerID } }).then(() => {
                                    response.json({
                                        Message: "Answer is added."
                                    });
                                });
                            }
                            else {
                                let newTraderAnswer = {
                                    TraderQuestionID: traderQuestion.TraderQuestionID,
                                    AdministratorID: result.Administrator.AdministratorID,
                                    Answer: request.body.Answer,
                                    Edited: false,
                                    Created: new Date()
                                };

                                TraderAnswers.create(newTraderAnswer).then(() => {
                                    response.json({
                                        Message: "Answer is added."
                                    });
                                });
                            }
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