var nodemailer = require("nodemailer");

const sender = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",
  auth: {
    user: "4astores1010@gmail.com",
    pass: "znunbbduhrscavgw",
  },
  debug: true,
  logger: true,
});

function prepareMail(data) {
  let mailbody = {
    from: "MusicPlayerEmotion",
    to: data.email,
    subject: "Forgot Password",
    text: "Make your password strong and easy to remember",
    html: `
        <p>Hi <strong>${data.name}</strong></p>
        <p>We noticed that you are having problem logging into our website.
        Please note that this link will only sustain to work for 24 hours.</p>
        <p>Click on this link <a href = '${data.link}'>here</a> to reset your password. </p>
        <p>If you did not send the request please contact the customer support for the possibility of intrusion </p>
        <p>Regards, </p>
        
        `,
  };
  return mailbody
};

module.exports = {
    sender,
    prepareMail
}