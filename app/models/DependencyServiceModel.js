import mongoose from 'mongoose'
var Schema = mongoose.Schema

var PropertyMapping = require('./PropertyMappingModel')

var DependencyServiceSchema = new Schema({
	service: { 
		type: Schema.Types.ObjectId, 
		ref: 'Service' 
	},
	mappedProperties: {
		type: [PropertyMapping.schema],
		default: []
	}
},{usePushEach: true})

export default mongoose.model('DependencyService', DependencyServiceSchema)