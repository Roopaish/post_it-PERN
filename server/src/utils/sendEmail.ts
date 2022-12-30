"use strict";
const nodemailer = require("nodemailer");

export async function sendEmail(to: string, html: string) {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"Post It Team" <post-it@example.com>', // sender address
    to, // list of receivers
    subject: "Post It: Change Password", // Subject line
    // text: text, // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
