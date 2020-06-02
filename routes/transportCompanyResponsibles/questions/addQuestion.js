const express = require("express");
const cors = require("cors");
const uuid = require("uuid-v4");
const passport = require("../../../helpers/passportHelper");
const ResponsibleQuestions = require("../../../models/responsibleQuestions");

var router = express.Router();
router.use(cors());

// POST: addQuestion
router.post("/addQuestion", (request, response) => {
    passport.authenticate("AuthenticateTransportCompanyResponsible", { session: false }, result => {
        try {
            if (result.Message === "Transport company responsible found.") {
                let newResponsibleQuestion = {
                    TransportCompanyResponsibleID: result.TransportCompanyResponsible.TransportCompanyResponsibleID,
                    QuestionNumber: uuid().substring(0, 8).toUpperCase(),
                    Question: request.body.Question,
                    Class: null,
                    Created: new Date()
                };

                ResponsibleQuestions.create(newResponsibleQuestion).then(() => {
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