const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderQuestions = require("../../../models/traderQuestions");
const Traders = require("../../../models/traders");
const TraderAnswers = require("../../../models/traderAnswers");
const Administrators = require("../../../models/administrators");

var router = express.Router();
router.use(cors());

// GET: getTraderQuestions
router.get("/getTraderQuestions", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TraderQuestions.findAll().then(async traderQuestions => {
                    if (traderQuestions) {
                        let modifiableTraderQuestions = [];
                        let count = 0;

                        for (let traderQuestion of traderQuestions) {
                            const trader = await Traders.findOne({
                                attributes: ["FirstName", "LastName", "Username"],
                                where: { TraderID: traderQuestion.TraderID }
                            });

                            let askedBy = {
                                FirstName: trader.FirstName,
                                LastName: trader.LastName,
                                Username: trader.Username
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