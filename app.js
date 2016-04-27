var config = require('./config.json');
var express = require('express');
var rev = require('express-rev');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var chalk = require('chalk'); // colour our output
var chalkColours = require('./chalk-colours');

var routes = require('./routes/index');
var users = require('./routes/users');
var pleas = require('./routes/pleas');
var ratings = require('./routes/ratings');

// db connection
var db;
var dbName = "njc_online_pleas";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(rev({
  manifest: './public/dist/rev-manifest.json',
  prepend: config.urls.public + "/dist"
}));

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
  // connect to mongodb
  mongoose.connect('mongodb://localhost/' + dbName);
  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function(callback){
    console.log(chalkColours.success("Connected to monogodb"));
  });
}
else {
  // connect to remote mongodb
  mongoose.connect(process.env.MONGOLAB_URI); // connect to local mongo
  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function(callback){
    console.log(chalkColours.success("Connected to monogodb"));
  });
}

module.exports = app;
