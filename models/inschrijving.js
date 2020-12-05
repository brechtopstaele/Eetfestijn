const { DateTime } = require("luxon");
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var InschrijvingSchema = new Schema(
  {
    first_name: {type: String, required: true, maxlength: 100},
    family_name: {type: String, required: true, maxlength: 100},
    date_of_birth: {type: Date},
    maaltijd:{type: Schema.Types.ObjectId, ref: 'Maaltijd', required: true},
  }
);

// Virtual for inschrijving's full name
InschrijvingSchema
.virtual('name')
.get(function () {
  return this.family_name + ' ' + this.first_name;
});


// Virtual for inschrijving's URL
InschrijvingSchema
.virtual('url')
.get(function () {
  return '/Home/inschrijving/' + this._id;
});

InschrijvingSchema
.virtual('date_of_birth_formatted')
.get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
});

//Export model
module.exports = mongoose.model('Inschrijving', InschrijvingSchema);