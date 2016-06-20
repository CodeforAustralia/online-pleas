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
      from: 'ezekiel@codeforaustralia.org',
      to: 'theatlasroom@gmail.com', // comma separated list
      subject: 'Online plea - ' + plea.id,
      text: 'Hello\nA new guilty plea has been submitted. \nYou will find the plea attached to this email.'
    };

    mailer.sendWithAttachment(email, attachment, function(err, response){
      if (err){ reject(err); }
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
    var new_key = key.replace("_", " ");
    //clean[new_key] = arr[key];
    clean.push({'key': new_key, 'value': arr[key]});
  }
  return clean;
}

function emailPlea(plea, baseurl){
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
      console.log(err);
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
      plead_guilty: plea.plead_guilty,
      acknowledgement: plea.acknowledgement
    }
  });

  p.save(function(err, result){
    if (err){ console.log(err); }
    var baseurl = req.protocol + '://' + req.get('host');
    // pass the raw plea information from the original request to the email template
    plea.id = result._id;
    emailPlea(plea, baseurl);
    // send the email with the pdf attached, remove any fields we dont need
    res.json(_.omit(p, ['_id']));
  });
});

// test the plea view
router.get('/test/email', function(req, res, next){
  var baseurl = req.protocol + '://' + req.get('host');
  var plea = JSON.parse('{"id":"23ed22d2ed","first_name":"Ezekiel","last_name":"Kigbo","address":"837 Bourke St, Docklands VIC 3008, Australia","birthday":"2016-03-04","contact_method":"phone","contact":"23424234","hearing_date":"2016-02-11","offence_date":"2016-03-04","offence_details":"Fashion killer","message":"I try my best m8.","acknowledgement":true,"plead_guilty":true}');
  emailPlea(plea, baseurl);
  res.send(plea);
});

// test the email
router.get('/test', function(req, res, next){
  //res.json("Hello");
  var baseurl = req.protocol + '://' + req.get('host');
  var plea = JSON.parse('{"id":"23ed22d2ed","first_name":"Ezekiel","last_name":"Kigbo","address":"837 Bourke St, Docklands VIC 3008, Australia","birthday":"2016-03-04","contact_method":"phone","contact":"23424234","hearing_date":"2016-02-11","offence_date":"2016-03-04","offence_number":"23ed22d2ed","offence_details":"Fashion killer","message":"I try my best m8.","acknowledgement":true,"plead_guilty":true}');
  res.send(plea);
});


module.exports = router;
