const express = require("express");
const cors = require("cors");
const codeGenerator = require("../../helpers/codeGenerator");
const emailHelper = require("../../helpers/emailHelper");

var router = express.Router();
router.use(cors());

// POST: sendCode
router.post("/sendCode", (request, response) => {
    try {
        const code = codeGenerator(6);

        const to = request.body.Email;
        const subject = "Confirmation Code";
        const message = `Your confirmation code is ${code}`;

        emailHelper.sendEmail(to, subject, message, () => {
            reposne.json({
                Message: "Code sent.",
                Code: code
            });
        });  
    }
    catch (error) {
        response.json({
            Message: error.message
        });
    }
});

module.exports = router;