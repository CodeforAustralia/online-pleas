var express = require('express');
var app = express();
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	// get the current environment
	//var env = JSON.stringify(process.env.NODE_ENV);
	var env = app.get('env');

	res.render('index', {
		title: 'NJC Online pleas',
		env: env
	});
});

module.exports = router;
