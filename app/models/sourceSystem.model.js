var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SourceSystemSchema = new Schema({
    name: String,
    color: String
});
  
module.exports = mongoose.model('SourceSystem', SourceSystemSchema);
