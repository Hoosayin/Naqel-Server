const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverQuestions = require("../../../models/driverQuestions");

var router = express.Router();
router.use(cors());

// POST: classifyDriverQuestion
router.post("/classifyDriverQuestion", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                DriverQuestions.findOne({
                    where: { DriverQuestionID: request.body.DriverQuestionID }
                }).then(driverQuestion => {
                    if (driverQuestion) {
                        let updatedDriverQuestion = {
                            Class: request.body.Class
                        };

                        DriverQuestions.update(updatedDriverQuestion, { where: { DriverQuestionID: driverQuestion.DriverQuestionID } }).then(() => {
                            response.json({
                                Message: "Question is classified."
                            });
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