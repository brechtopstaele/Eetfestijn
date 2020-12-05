const { DateTime } = require("luxon");
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VrijwilligerSchema = new Schema(
  {
    first_name: {type: String, required: true, maxlength: 100},
    family_name: {type: String, required: true, maxlength: 100},
    date_of_birth: {type: Date},
  }
);

// Virtual for vrijwilliger's full name
VrijwilligerSchema
.virtual('name')
.get(function () {
  return this.family_name + ' ' + this.first_name;
});


// Virtual for vrijwilliger's URL
VrijwilligerSchema
.virtual('url')
.get(function () {
  return '/Home/vrijwilliger/' + this._id;
});

VrijwilligerSchema
.virtual('date_of_birth_formatted')
.get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
});

//Export model
module.exports = mongoose.model('Vrijwilliger', VrijwilligerSchema);