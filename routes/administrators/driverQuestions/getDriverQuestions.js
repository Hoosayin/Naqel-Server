const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverQuestions = require("../../../models/driverQuestions");
const Drivers = require("../../../models/drivers");
const DriverAnswers = require("../../../models/driverAnswers");
const Administrators = require("../../../models/administrators");

var router = express.Router();
router.use(cors());

// GET: getDriverQuestions
router.get("/getDriverQuestions", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                DriverQuestions.findAll().then(async driverQuestions => {
                    if (driverQuestions) {
                        let modifiableDriverQuestions = [];
                        let count = 0;

                        for (let driverQuestion of driverQuestions) {
                            const driver = await Drivers.findOne({
                                attributes: ["FirstName", "LastName", "Username"],
                                where: { DriverID: driverQuestion.DriverID }
                            });

                            let askedBy = {
                                FirstName: driver.FirstName,
                                LastName: driver.LastName,
                                Username: driver.Username
                            };

                            let modifableDriverAnswer = null;

                            const driverAnswer = await DriverAnswers.findOne({
                                where: { DriverQuestionID: driverQuestion.DriverQuestionID }
                            });

                            if (driverAnswer) {
                                const administrator = await Administrators.findOne({
                                    attributes: ["FirstName", "LastName", "Username"],
                                    where: { AdministratorID: driverAnswer.AdministratorID }
                                });

                                let answeredBy = {
                                    FirstName: administrator.FirstName,
                                    LastName: administrator.LastName,
                                    Username: administrator.Username
                                };

                                modifableDriverAnswer = driverAnswer.dataValues;
                                modifableDriverAnswer.AnsweredBy = answeredBy;
                            }

                            let modifiableDriverQuestion = driverQuestion.dataValues;
                            modifiableDriverQuestion.AskedBy = askedBy;
                            modifiableDriverQuestion.DriverAnswer = modifableDriverAnswer;

                            modifiableDriverQuestions[count++] = modifiableDriverQuestion;
                        }

                        if (modifiableDriverQuestions.length > 0) {
                            modifiableDriverQuestions.sort((a, b) => {
                                let dateA = new Date(a.Created);
                                let dateB = new Date(b.Created);
                                return dateB - dateA;
                            });
                        }

                        response.json({
                            Message: "Questions found.",
                            Questions: modifiableDriverQuestions
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