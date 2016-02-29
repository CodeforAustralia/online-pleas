var mailer = require('./mailer');
var message = {
  from: 'ezekiel@codeforaustralia.org',
  to: 'theatlasroom@gmail.com', // comma separated list
  subject: 'Subject Line',
  text: 'Text contents.',
  html: '<b>Text contents.</b>'
};

mailer.send(message, function(error, response){
  if (error) return console.error("There was a problem sending your email", error);

  console.log(response);
});
