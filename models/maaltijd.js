var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MaaltijdSchema = new Schema(
  {
    naam: {type: String, required: true},
    hoofd_ingredient: {type: String, required: true},
    prijs: {type: Number ,min: 0, max: 50, required: true},
    summary: {type: String, required: true},
  }
);

// Virtual for maaltijd's URL
MaaltijdSchema
.virtual('url')
.get(function () {
  return '/Home/maaltijd/' + this._id;
});

//Export model
module.exports = mongoose.model('Maaltijd', MaaltijdSchema);