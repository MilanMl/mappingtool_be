var Schema = mongoose.Schema

import Property from './PropertyModel'
import mongoose from 'mongoose'
import ENUMS from '../enums'

var ServiceSchema = new Schema({
	serviceName: {
		type: String,
		minlength: 5,
		maxlength: 128
	},
	sourceSystem: { 
		type: Schema.Types.ObjectId, 
		ref: 'SourceSystem' 
	},
	serviceType: {
		type: String,
		enum: [ENUMS.SERVICE_TYPES.REST,ENUMS.SERVICE_TYPES.SOAP]
	},
	description: {
		type: String
	},
	checked: Boolean,
	checkedBy: String,
	version: { 
		type: Schema.Types.ObjectId, 
		ref: 'Version' 
	},
	userDefined: Boolean,
	createdAt: Date,
	createdBy: String,
	lastModifiedAt: Date,
	lastModifiedBy: String,
	active: Boolean,
	properties: [Property.schema]
}, {usePushEach: true})

export default mongoose.model('Service', ServiceSchema)