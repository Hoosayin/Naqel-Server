const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderQuestionClasses = require("../../../models/traderQuestionClasses");

var router = express.Router();
router.use(cors());

// POST: addTraderQuestionClass
router.post("/addTraderQuestionClass", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                let newTraderQuestionClass = {
                    Class: request.body.Class
                };

                TraderQuestionClasses.create(newTraderQuestionClass).then(traderQuestionClass => {
                    response.json({
                        Message: "Question class is added.",
                        QuestionClass: traderQuestionClass
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