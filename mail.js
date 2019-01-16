var nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');

var transporter = nodemailer.createTransport(sendmailTransport(options))

transporter.sendMail({
  from: 'test@yourdomain.com',
  to: 'robertonunesinfo@gmail.com',
  subject: 'MailComposer sendmail',
  html: 'Mail of test sendmail '
}