'use strict';
var _ = require('lodash');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var jade = require('jade');
var pdf = require('html-pdf');
var mailer = require('../mailer');
var Pleas = require('../models/pleas');

function sendEmailWithAttachment(opts, plea, attachment){
  return new Promise(function(resolve, reject){
    var email = {
      from: process.env.MAILGUN_SENDER,
      to: process.env.EMAIL_INBOX, // comma separated list
      subject: 'Online plea ' + plea.id + ' - ' + plea.given_name + " " + plea.family_name,
      text: 'Hello\nA new guilty plea has been submitted. \nYou will find the plea attached to this email.'
    };

    mailer.sendWithAttachment(email, attachment, function(err, response){
      if (err){
        console.log(err);
        reject(err);
      }
      resolve(response);
    });
  });
}

function createEmailPlea(plea, baseurl){
  //var html = res.render('plea', plea);
  return new Promise(function(resolve, reject){

    fs.readFile('./views/plea.jade', 'utf8', function(err, data){
      if (err){ reject(err); }
      //console.log(data);
      var fn = jade.compile(data);
      var html = fn({base_url: baseurl, pretty_data: cleanupLabels(plea), data: plea});
      // get a
      //console.log(html);

      var pdf_opts = {
        border: {
          "top": "0.5in",            // default is 0, units: mm, cm, in, px
          "right": "0.25in",
          "bottom": "0.5in",
          "left": "0.25in"
        },
      };

      // convert it to a pdf - use a buffer obj
      //pdf.create(html, pdf_opts).toFile('./uploads/test.pdf', function(err, res) {
      pdf.create(html, pdf_opts).toBuffer(function(err, res) {
        if (err){ reject(err); }
        // resolve the promise with the buffer obj
        resolve(res);
      });
    });

  });
 }

function cleanupLabels(arr){
  var clean = [];
  for (var key in arr){
    if (arr[key].label && arr[key].value){
      //clean[new_key] = arr[key];
      clean.push({'key': arr[key].label, 'value': arr[key].value});
    }
    else {
      //clean[new_key] = arr[key];
      clean.push({'key': key.replace("_", " "), 'value': arr[key]});
    }
  }
  return clean;
}

function emailPlea(plea, baseurl, cb){
  console.log("Emailling the plea");
  console.log(plea);
  createEmailPlea(plea, baseurl)
    .then(function(buffer){
      console.log("Got the buffer of data");
      sendEmailWithAttachment(null, plea, buffer)
        .then(function(data){
          console.log("SENT");
        });
      //res.render('plea', {base_url: baseurl, pretty_data: cleanupLabels(plea), data: plea});
    })
    .catch(function(err){
      cb(err);
    });
}

/* POST Submit a plea */
router.post('/', function(req, res, next) {
  // generate the html document
  // grab the data we need from the request
  var plea = {
    'given_name': req.body.given_name,
    'family_name': req.body.family_name,
    'address': req.body.address,
    'birthday': req.body.birthday,
    'contact_method': req.body.contact_method,
    'contact': req.body.contact,
    'hearing_date': req.body.hearing_date,
    'offence_date': req.body.offence_date,
    'offence_details': req.body.offence_details,
    'message': req.body.message,
    'plead_guilty': req.body.plead_guilty,
    'acknowledgement': req.body.acknowledgement
  };

  var p = new Pleas({
    details: {
      given_name: plea.given_name,
      family_name: plea.family_name,
      address: plea.address,
      birthday: plea.birthday,
      contact_method: plea.contact_method,
      contact: plea.contact,
    },
    offence: {
      hearing_date: plea.hearing_date,
      offence_date: plea.offence_date,
      offence_details: plea.offence_details,
      message: plea.message,
    },
    declarations: {
      plead_guilty: plea.plead_guilty.value,
      acknowledgement: plea.acknowledgement.value
    }
  });

  p.save(function(err, result){
    if (err){ next(err); }
    var baseurl = req.protocol + '://' + req.get('host');
    // pass the raw plea information from the original request to the email template
    plea.id = result._id;
    emailPlea(plea, baseurl, function(err, res){
      // send the email with the pdf attached, remove any fields we dont need
      if (err) next(err);
      console.log("email sent");
    });

    res.json(_.omit(p, ['_id']));
  });
});

module.exports = router;
