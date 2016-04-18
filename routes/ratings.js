var express = require('express');
var router = express.Router();
var Ratings = require('../models/ratings');
var mongoose = require('mongoose');


/* POST Submit a plea */
router.post('/', function(req, res, next) {
  // generate the html document
  var params = req.body;
  var x = {};

  console.log(params);

  var r = new Ratings({
    rating: params.rating,
    comments: params.comments
  });

  r.save(function(err){
    if (err) console.log(err);
    x = r;
  });

  res.json(x);
});

module.exports = router;
