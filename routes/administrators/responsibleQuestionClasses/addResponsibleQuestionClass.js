const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const ResponsibleQuestionClasses = require("../../../models/responsibleQuestionClasses");

var router = express.Router();
router.use(cors());

// POST: addResponsibleQuestionClass
router.post("/addResponsibleQuestionClass", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let newResponsibleQuestionClass = {
                    Class: request.body.Class
                };

                ResponsibleQuestionClasses.create(newResponsibleQuestionClass).then(responsibleQuestionClass => {
                    response.json({
                        Message: "Question class is added.",
                        QuestionClass: responsibleQuestionClass
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