import mongoose from 'mongoose';
import ENUMS from '../enums';

var DependencyService = require('./DependencyServiceModel');

var Schema = mongoose.Schema;

var ServiceMapping = new Schema({
    mappingName: {
        type: String
    },
    mappedService: { 
        type: Schema.Types.ObjectId, 
        ref: 'Service'
    },
    dependencyServices: {
        type: [{ 
            type: DependencyService.schema 
        }],
        default: []
    }
});

module.exports = mongoose.model('ServiceMapping', ServiceMapping);