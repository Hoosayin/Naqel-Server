const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const ResponsibleQuestions = require("../../../models/responsibleQuestions");
const ResponsibleAnswers = require("../../../models/responsibleAnswers");

var router = express.Router();
router.use(cors());

// POST: deleteQuestion
router.delete("/deleteQuestion", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, result => {
        try {
            if (result.Message === "Transport company responsible found.") {
                ResponsibleQuestions.findOne({
                    where: { ResponsibleQuestionID: request.body.ResponsibleQuestionID }
                }).then(responsibleQuestion => {
                    if (responsibleQuestion) {
                        ResponsibleAnswers.destroy({
                            where: { ResponsibleQuestionID: responsibleQuestion.ResponsibleQuestionID }
                        }).then(() => {
                            responsibleQuestion.destroy();

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