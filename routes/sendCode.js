const express = require("express");
const cors = require("cors");
const codeGenerator = require("../helpers/codeGenerator");
const emailHelper = require("../helpers/emailHelper");

var router = express.Router();
router.use(cors());

// POST: sendCode
router.post("/sendCode", (req, res) => {
    try {
        const code = codeGenerator(6);

        const to = req.body.Email;
        const subject = "Confirmation Code";
        const message = `Your confirmation code is ${code}`;

        emailHelper.sendEmail(to, subject, message, () => {
            res.send(code);
        });      
    }
    catch (error) {
        return res.send(error);
    }
});

module.exports = router;