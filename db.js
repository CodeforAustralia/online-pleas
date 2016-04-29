var mongoose = require('mongoose');
var chalkcol = require('./chalk-colours');

// db connection
var db, dbName;

module.exports = {
  conn: function(){
    return db;
  },

  connect: function(connection_url){
    // connect to our database
    console.log("connecting to: " + connection_url);
    mongoose.connect(connection_url);
    db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(callback){
      console.log(chalkcol.success("Connected to database"));
    });
  }
};
