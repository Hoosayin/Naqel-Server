const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverQuestionClasses = require("../../../models/driverQuestionClasses");

var router = express.Router();
router.use(cors());

// GET: getDriverQuestionClasses
router.get("/getDriverQuestionClasses", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, async result => {
        try {
            if (result.Message === "Administrator found.") {
                DriverQuestionClasses.findAll().then(driverQuestionClasses => {
                    if (driverQuestionClasses) {
                        response.json({
                            Message: "Question classes found.",
                            QuestionClasses: driverQuestionClasses,
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