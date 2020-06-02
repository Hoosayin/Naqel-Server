const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const ResponsibleQuestions = require("../../../models/responsibleQuestions");
const ResponsibleAnswers = require("../../../models/responsibleAnswers");
const Administrators = require("../../../models/administrators");

var router = express.Router();
router.use(cors());

// GET: getQuestions
router.get("/getQuestions", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, result => {
        try {
            if (result.Message === "Transport company responsible found.") {
                ResponsibleQuestions.findAll({
                    where: { TransportCompanyResponsibleID: result.TransportCompanyResponsible.TransportCompanyResponsibleID }
                }).then(async responsibleQuestions => {
                    if (responsibleQuestions) {
                        let modifiableResponsibleQuestions = [];
                        let count = 0;

                        for (let responsibleQuestion of responsibleQuestions) {
                            let askedBy = {
                                Name: result.TransportCompanyResponsible.Name,
                                Username: result.TransportCompanyResponsible.Username
                            };

                            let modifableResponsibleAnswer = null;

                            const responsibleAnswer = await ResponsibleAnswers.findOne({
                                where: { ResponsibleQuestionID: responsibleQuestion.ResponsibleQuestionID }
                            });

                            if (responsibleAnswer) {
                                const administrator = await Administrators.findOne({
                                    attributes: ["FirstName", "LastName", "Username"],
                                    where: { AdministratorID: responsibleAnswer.AdministratorID }
                                });

                                let answeredBy = {
                                    FirstName: administrator.FirstName,
                                    LastName: administrator.LastName,
                                    Username: administrator.Username
                                };

                                modifableResponsibleAnswer = responsibleAnswer.dataValues;
                                modifableResponsibleAnswer.AnsweredBy = answeredBy;
                            }

                            let modifiableResponsibleQuestion = responsibleQuestion.dataValues;
                            modifiableResponsibleQuestion.AskedBy = askedBy;
                            modifiableResponsibleQuestion.ResponsibleAnswer = modifableResponsibleAnswer;

                            modifiableResponsibleQuestions[count++] = modifiableResponsibleQuestion;
                        }

                        if (modifiableResponsibleQuestions.length > 0) {
                            modifiableResponsibleQuestions.sort((a, b) => {
                                let dateA = new Date(a.Created);
                                let dateB = new Date(b.Created);
                                return dateB - dateA;
                            });
                        }

                        response.json({
                            Message: "Questions found.",
                            Questions: modifiableResponsibleQuestions
                        });
                    }
                    else {
                        response.json({
                            Message: "Questions not found."
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