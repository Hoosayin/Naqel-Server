const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderQuestions = require("../../../models/traderQuestions");
const TraderAnswers = require("../../../models/traderAnswers");
const Administrators = require("../../../models/administrators");

var router = express.Router();
router.use(cors());

// GET: getQuestions
router.get("/getQuestions", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                TraderQuestions.findAll({
                    where: { TraderID: result.Trader.TraderID }
                }).then(async traderQuestions => {
                    if (traderQuestions) {
                        let modifiableTraderQuestions = [];
                        let count = 0;

                        for (let traderQuestion of traderQuestions) {
                            let askedBy = {
                                FirstName: result.Trader.FirstName,
                                LastName: result.Trader.LastName,
                                Username: result.Trader.Username
                            };

                            let modifiableTraderAnswer = null;

                            const traderAnswer = await TraderAnswers.findOne({
                                where: { TraderQuestionID: traderQuestion.TraderQuestionID }
                            });

                            if (traderAnswer) {
                                const administrator = await Administrators.findOne({
                                    attributes: ["FirstName", "LastName", "Username"],
                                    where: { AdministratorID: traderAnswer.AdministratorID }
                                });

                                let answeredBy = {
                                    FirstName: administrator.FirstName,
                                    LastName: administrator.LastName,
                                    Username: administrator.Username
                                };

                                modifiableTraderAnswer = traderAnswer.dataValues;
                                modifiableTraderAnswer.AnsweredBy = answeredBy;
                            }

                            let modifiableTraderQuestion = traderQuestion.dataValues;
                            modifiableTraderQuestion.AskedBy = askedBy;
                            modifiableTraderQuestion.TraderAnswer = modifiableTraderAnswer;

                            modifiableTraderQuestions[count++] = modifiableTraderQuestion;
                        }

                        if (modifiableTraderQuestions.length > 0) {
                            modifiableTraderQuestions.sort((a, b) => {
                                let dateA = new Date(a.Created);
                                let dateB = new Date(b.Created);
                                return dateB - dateA;
                            });
                        }

                        response.json({
                            Message: "Questions found.",
                            Questions: modifiableTraderQuestions
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