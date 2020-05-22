const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverQuestions = require("../../../models/driverQuestions");
const DriverAnswers = require("../../../models/driverAnswers");

var router = express.Router();
router.use(cors());

// POST: addDriverObjectionReason
router.post("/addDriverAnswer", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                DriverQuestions.findOne({
                    where: { DriverQuestionID: request.body.DriverQuestionID }
                }).then(driverQuestion => {
                    if (driverQuestion) {
                        DriverAnswers.findOne({
                            where: { DriverQuestionID: driverQuestion.DriverQuestionID }
                        }).then(driverAnswer => {
                            if (driverAnswer) {
                                let updatedDriverAnswer = {
                                    AdministratorID: result.Administrator.AdministratorID,
                                    Answer: request.body.Answer,
                                    Edited: true,
                                    Created: new Date()
                                };

                                DriverAnswers.update(updatedDriverAnswer, { where: { DriverAnswerID: driverAnswer.DriverAnswerID } }).then(() => {
                                    response.json({
                                        Message: "Answer is added."
                                    });
                                });
                            }
                            else {
                                let newDriverAnswer = {
                                    DriverQuestionID: driverQuestion.DriverQuestionID,
                                    AdministratorID: result.Administrator.AdministratorID,
                                    Answer: request.body.Answer,
                                    Edited: false,
                                    Created: new Date()
                                };

                                DriverAnswers.create(newDriverAnswer).then(() => {
                                    response.json({
                                        Message: "Answer is added."
                                    });
                                });
                            }
                        });
                    }
                    else {
                        response.json({
                            Message: "Driver question not found."
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