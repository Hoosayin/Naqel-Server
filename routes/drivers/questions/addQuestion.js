const express = require("express");
const cors = require("cors");
const uuid = require("uuid-v4");
const passport = require("../../../helpers/passportHelper");
const DriverQuestions = require("../../../models/driverQuestions");

var router = express.Router();
router.use(cors());

// POST: addQuestion
router.post("/addQuestion", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                let newDriverQuestion = {
                    DriverID: result.Driver.DriverID,
                    QuestionNumber: uuid().substring(0, 8).toUpperCase(),
                    Question: request.body.Question,
                    Class: null,
                    Created: new Date()
                };

                DriverQuestions.create(newDriverQuestion).then(() => {
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