var Mailjet = require("node-mailjet").connect(
  "559dd442af8a673fd0ace9b5c08c9656",
  "6e6b7cb405632333b0321a1900b66348"
);
var sendEmail = Mailjet.post("send");

send = (FromName, subject, text, Recipients) => {
  var emailData = {
    FromEmail: "bibou.polytech@gmail.com",
    FromName,
    Subject: subject,
    "Text-part": text,
    Recipients: Recipients.map(recipient => {
      return {
        Email: recipient
      };
    })
  };
  return sendEmail.request(emailData);
};
module.exports = send;

/* Usage
var sendMail = require("./MailSender");

sendMail("Kevin", "Test mail", "Hello from node", [
  "giordani.kevin.02@gmail.com"
])
  .then(res => console.log(res))
  .catch(err => console.log(err));
*/
