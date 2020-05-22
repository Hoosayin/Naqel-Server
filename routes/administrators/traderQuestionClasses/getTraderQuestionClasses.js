const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderQuestionClasses = require("../../../models/traderQuestionClasses");

var router = express.Router();
router.use(cors());

// GET: getTraderQuestionClasses
router.get("/getTraderQuestionClasses", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TraderQuestionClasses.findAll().then(traderQuestionClasses => {
                    if (traderQuestionClasses) {
                        response.json({
                            Message: "Question classes found.",
                            QuestionClasses: traderQuestionClasses,
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