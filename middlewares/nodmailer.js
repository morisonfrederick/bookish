const nodemailer = require("nodemailer");
require("dotenv").config()

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.MAILER_MAIL,
    pass: process.env.MAILER_PASS,
  },
  debug: true,
});


// async..await is not allowed in global scope, must use a wrapper
async function sendMail(USERMAIL,otp) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"THE BOOK" <M8089989272@GMAIL.COM>', // sender address
    to: USERMAIL, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Hello world? ${otp}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

module.exports = sendMail