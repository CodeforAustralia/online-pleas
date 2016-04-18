// load the mongoose driver
var mongoose = require('mongoose');

var PleaSchema = mongoose.Schema({
  details: {
    given_name: String,
    family_name: String,
    address: String,
    birthday: String,
    contact_method: String,
    contact: String,
  },
  offence: {
    hearing_date: String,
    offence_date: String,
    offence_details: String,
    message: String,
  },
  declarations: {
    plead_guilty: Boolean,
    acknowledgement: Boolean
  },
  created_at: {type: Date, default: new Date()}
});

module.exports = mongoose.model('Pleas', PleaSchema);
