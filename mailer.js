/**
 * Sends an email.
 * @function
 */
'use strict';

// grab the api key
var api_key = process.env.MAILGUN_SECRET;
var domain = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var fs = require('fs');

var mailer = {
  sendWithAttachment: function(message, path, callback){
    var attachment = new mailgun.Attachment({data: path, filename: 'attachment.pdf'});

    message.attachment = attachment;
    this.send(message, callback);
  },
  send: function(message, callback){
    mailgun.messages().send(message, callback);
  }
};

module.exports = mailer;
