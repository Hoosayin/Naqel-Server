const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverQuestions = require("../../../models/driverQuestions");
const DriverAnswers = require("../../../models/driverAnswers");

var router = express.Router();
router.use(cors());

// POST: deleteQuestion
router.delete("/deleteQuestion", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverQuestions.findOne({
                    where: { DriverQuestionID: request.body.DriverQuestionID }
                }).then(driverQuestion => {
                    if (driverQuestion) {
                        DriverAnswers.destroy({
                            where: { DriverQuestionID: driverQuestion.DriverQuestionID }
                        }).then(() => {
                            driverQuestion.destroy();

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