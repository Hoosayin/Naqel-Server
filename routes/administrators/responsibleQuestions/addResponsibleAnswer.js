const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const ResponsibleQuestions = require("../../../models/responsibleQuestions");
const ResponsibleAnswers = require("../../../models/responsibleAnswers");

var router = express.Router();
router.use(cors());

// POST: addResponsibleAnswer
router.post("/addResponsibleAnswer", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                ResponsibleQuestions.findOne({
                    where: { ResponsibleQuestionID: request.body.ResponsibleQuestionID }
                }).then(responsibleQuestion => {
                    if (responsibleQuestion) {
                        ResponsibleAnswers.findOne({
                            where: { ResponsibleQuestionID: responsibleQuestion.ResponsibleQuestionID }
                        }).then(responsibleAnswer => {
                            if (responsibleAnswer) {
                                let updatedResponsibleAnswer = {
                                    AdministratorID: result.Administrator.AdministratorID,
                                    Answer: request.body.Answer,
                                    Edited: true,
                                    Created: new Date()
                                };

                                ResponsibleAnswers.update(updatedResponsibleAnswer, { where: { ResponsibleAnswerID: ResponsibleAnswer.ResponsibleAnswerID } }).then(() => {
                                    response.json({
                                        Message: "Answer is added."
                                    });
                                });
                            }
                            else {
                                let newResponsibleAnswer = {
                                    ResponsibleQuestionID: responsibleQuestion.ResponsibleQuestionID,
                                    AdministratorID: result.Administrator.AdministratorID,
                                    Answer: request.body.Answer,
                                    Edited: false,
                                    Created: new Date()
                                };

                                ResponsibleAnswers.create(newResponsibleAnswer).then(() => {
                                    response.json({
                                        Message: "Answer is added."
                                    });
                                });
                            }
                        });
                    }
                    else {
                        response.json({
                            Message: "Responible question not found."
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