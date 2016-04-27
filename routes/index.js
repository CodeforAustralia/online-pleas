var express = require('express');
var router = express.Router();
var app = express();
var config = require('../config.json');
var _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
	// get the current environment
	//var env = JSON.stringify(process.env.NODE_ENV);
	var env = app.settings.env;

	res.render('index', { 
		title: 'NJC Online pleas',
		env: env
	});
});

module.exports = router;
