const nodeMailer = require("nodemailer");

const emailHelper = {};

emailHelper.sendEmail = (to, subject, message, onEmailSent) => {
    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: "naqelTB@gmail.com",
            pass: "Naqel@2020",
        },
    });

    const mailOptions = {
        from: "naqelTB@gmail.com",
        to: to,
        subject: subject,
        html: `<table><tr><td style = \"padding: 20px; border: solid 5px #DADADA; color: #505050;; background-color: #F4F4F4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif\"><img src = \"https://firebasestorage.googleapis.com/v0/b/naqel-transport-jobs.appspot.com/o/Miscellaneous%2Ftruck.png?alt=media&token=b9554d2f-47ef-48a8-a2dc-6d74201ec268\" height = \"50\" style = \"border-radius: 50%;\" /><h3>Naqel</h3><hr /><p>${message}</p></td></tr></table>`,
    };

    console.log("sending mail");
    transporter.sendMail(mailOptions);
    onEmailSent();
};

module.exports = emailHelper;