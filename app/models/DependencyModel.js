var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var Property = require('./PropertyModel');
var PropertyDependency = require('./PropertyDependencyModel');
var CodetableDependency = require('./CodetableDependencyModel');

var DependencySchema = new Schema({
    dependencyType: {type: String, enum: ['property','codetable','const']},
    codetable: {
        codetable: String,
        value: String
    },
    const: String,
    description: String
});

module.exports = mongoose.model('Dependency', DependencySchema)