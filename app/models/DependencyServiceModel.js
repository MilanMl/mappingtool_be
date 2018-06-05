var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PropertyMapping = require('./PropertyMappingModel');
var Service = require('./ServiceModel');

var DependencyServiceSchema = new Schema({
    service: { 
        type: Schema.Types.ObjectId, 
        ref: 'Service' 
    },
    mappedProperties: {
        type: [{ 
                type: PropertyMapping.schema
        }],
        default: []
    }
});

module.exports = mongoose.model('DependencyService', DependencyServiceSchema)