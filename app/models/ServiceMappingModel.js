import mongoose from 'mongoose';

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
            type: Schema.Types.ObjectId, 
            ref: 'DependencyService'
        }],
        default: []
    }
});

module.exports = mongoose.model('ServiceMapping', ServiceMapping);