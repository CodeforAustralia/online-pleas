// load the mongoose driver
var mongoose = require('mongoose');

var RatingSchema = mongoose.Schema({
  rating: Number,
  comments: String,
  created_at: {type: Date, default: new Date()}  
});

module.exports = mongoose.model('Ratings', RatingSchema);
