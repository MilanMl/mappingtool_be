var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var CodetableDependencySchema = new Schema({
    codetable: { 
        type: String
    },
    value: { 
        type: String
    }
});

module.exports = mongoose.model('CodetableDependency', CodetableDependencySchema)