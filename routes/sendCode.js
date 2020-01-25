const express = require("express");
const cors = require("cors");
const nodeMailer = require("nodemailer");
const codeGenerator = require("../helpers/codeGenerator");

var router = express.Router();
router.use(cors());

// POST: sendCode
router.post("/sendCode", (req, res) => {
    try {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: "gurdwara.sri.panja.sahib@gmail.com",
                pass: "LP2twigs",
            },
        });

        const code = codeGenerator(6);
        const message = `Your confirmation code is ${code}`;

        const mailOptions = {
            from: "gurdwara.sri.panja.sahib@gmail.com",
            to: req.body.Email,
            subject: 'Confirmation Code',
            html: `<table><tr><td style = \"padding: 20px; border: solid 5px #DADADA; color: #505050;; background-color: #F4F4F4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif\"><img src = \"https://pp.userapi.com/c847018/v847018625/1d7ecd/7xqdG3br0TA.jpg\" height = \"50\" style = \"border-radius: 50%;\" /><h3>Naqel</h3><hr /><p>${message}</p></td></tr></table>`,
        };

        console.log('sending mail');

        transporter.sendMail(mailOptions);
        res.send(code);
    }
    catch (error) {
        return res.send(error);
    }
});

module.exports = router;