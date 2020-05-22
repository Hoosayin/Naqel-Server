const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverQuestionClasses = require("../../../models/driverQuestionClasses");

var router = express.Router();
router.use(cors());

// POST: addDriverQuestionClass
router.post("/addDriverQuestionClass", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let newDriverQuestionClass = {
                    Class: request.body.Class
                };

                DriverQuestionClasses.create(newDriverQuestionClass).then(driverQuestionClass => {
                    response.json({
                        Message: "Question class is added.",
                        QuestionClass: driverQuestionClass
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