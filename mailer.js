/**
 * Sends an email.
 * @function
 */
/*var sendMail = function (message, callback) {

  var transporter
    , message;

  transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      // RMEOVE THIS BEFORE DEPLOYING
      user: 'postmaster@sandbox68ac12ee9b9d42248d2e1ce0899b60b8.mailgun.org', // postmaster@sandbox[base64 string].mailgain.org
      pass: '11f7b8a0f1224c49267424bc640c20ed' // You set this.
    }
  });

  message = {
    from: 'YourServer ',
    to: 'firstname.lastname@gmail.com', // comma separated list
    subject: 'Subject Line',
    text: 'Text contents.',
    html: '<b>Text contents.</b>'
  };

  transporter.sendMail(message, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Sent: ' + info.response);
    }
  });
};*/

var api_key ='key-1f3f2b0bc88c6b48652071784b9d6687';
var domain = 'njc.codeforaustralia.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var fs = require('fs');

var mailer = {
  sendWithAttachment: function(message, path, callback){
    //var fileStream = fs.createReadStream(path);
    //var fileStat = fs.statSync(path);
    // create the attachement filestream
    var attch = new mailgun.Attachment({data: path, filename: 'attachment.pdf'});
    //console.log(attch);

    message.attachment = attch;
    this.send(message, callback);
  },
  send: function(message, callback){
    mailgun.messages().send(message, callback);
  }
};

module.exports = mailer;
