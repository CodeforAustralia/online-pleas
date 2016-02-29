var fs = require('fs');
var express = require('express');
var router = express.Router();
var jade = require('jade');
var pdf = require('html-pdf');
var mailgun = require('mailgun-js');
var mailer = require('../mailer');

function cleanupLabels(arr){
  var clean = {};
  console.log("Cleaning labels");
  for (var key in arr){
    var new_key = key.replace("_", " ");
    clean[new_key] = arr[key];
  }
  return clean;
}


// test the plea view
router.get('/test', function(req, res, next){
  var baseurl = req.protocol + '://' + req.get('host');
  var plea = JSON.parse('{"first_name":"Ezekiel","last_name":"Kigbo","address":"837 Bourke St, Docklands VIC 3008, Australia","birthday":"2016-03-04","contact_method":"phone","contact":"23424234","hearing_date":"2016-02-11","offence_date":"2016-03-04","offence_number":"23ed22d2ed","offence_details":"Fashion killer","message":"I try my best m8.","acknowledgement":true,"plead_guilty":true}');
  console.log(plea);
  res.render('plea', {base_url: baseurl, pretty_data: cleanupLabels(plea), data: plea});
});

/* POST Submit a plea */
router.post('/', function(req, res, next) {
  console.log(req.body);
  //console.log(process);
  //console.log(process.cwd());
  // generate the html document
  var plea = req.body;
  //var html = res.render('plea', plea);
  fs.readFile('./views/plea.jade', 'utf8', function(err, data){
    var baseurl = req.protocol + '://' + req.get('host');
    if (err) throw err;
    console.log(data);
    var fn = jade.compile(data);
    var html = fn({base_url: baseurl, pretty_data: cleanupLabels(plea), data: plea});
    console.log(html);

    var pdf_opts = {
      border: {
        "top": "0.5in",            // default is 0, units: mm, cm, in, px
        "right": "0.25in",
        "bottom": "0.5in",
        "left": "0.25in"
      },
    };

    // convert it to a pdf
    pdf.create(html, pdf_opts).toFile('./test.pdf', function(err, res) {
      if (err) return console.log(err);
      console.log(res); // { filename: '/app/businesscard.pdf' }

      var file = res.filename;
      // create the file stream and get the file stats

      var email = {
        from: 'ezekiel@codeforaustralia.org',
        to: 'theatlasroom@gmail.com', // comma separated list
        subject: 'Subject Line',
        text: 'Text contents.',
        html: '<b>Text contents.</b>',
      };


      mailer.sendWithAttachment(email, file, function(error, response){
        if (error) return console.error("There was a problem sending your email", error);

        console.log(response);
      });

    });

    res.send("Cool");
  });

  // send the email with the pdf attached
});

module.exports = router;
