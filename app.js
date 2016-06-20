require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var pleas = require('./routes/pleas');
var ratings = require('./routes/ratings');

// db connector
var db = require('./db');

var app = express();
var config = process.env; // load configs from the process
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// use this because we are behind a proxy
app.set('trust proxy', true);

// set the static asset path
app.use(compression()); //use compression
app.use(express.static(path.join(__dirname, 'public')));
app.use('/online-pleas/static', express.static('public'));

app.use('/pleas', pleas);
app.use('/ratings', ratings);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// connect our db
db.connect(process.env.MONGO_URL);
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
else {
  // production settings
}

module.exports = app;
