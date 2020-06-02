const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const ResponsibleQuestions = require("../../../models/responsibleQuestions");

var router = express.Router();
router.use(cors());

// POST: classifyResponsibleQuestion
router.post("/classifyResponsibleQuestion", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                ResponsibleQuestions.findOne({
                    where: { ResponsibleQuestionID: request.body.ResponsibleQuestionID }
                }).then(responsibleQuestion => {
                    if (responsibleQuestion) {
                        let updatedResponsibleQuestion = {
                            Class: request.body.Class
                        };

                        ResponsibleQuestions.update(updatedResponsibleQuestion, { where: { ResponsibleQuestionID: responsibleQuestion.ResponsibleQuestionID } }).then(() => {
                            response.json({
                                Message: "Question is classified."
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Responsible question not found."
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