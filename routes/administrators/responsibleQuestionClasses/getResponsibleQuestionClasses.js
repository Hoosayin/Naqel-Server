const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const ResponsibleQuestionClasses = require("../../../models/responsibleQuestionClasses");

var router = express.Router();
router.use(cors());

// GET: getResponsibleQuestionClasses
router.get("/getResponsibleQuestionClasses", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, async result => {
        try {
            if (result.Message === "Administrator found.") {
                ResponsibleQuestionClasses.findAll().then(responsibleQuestionClasses => {
                    if (responsibleQuestionClasses) {
                        response.json({
                            Message: "Question classes found.",
                            QuestionClasses: responsibleQuestionClasses,
                        });
                    }
                    else {
                        response.json({
                            Message: "Question classes not found."
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