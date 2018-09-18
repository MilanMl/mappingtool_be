import mongoose from 'mongoose'
import ENUMS from '../enums'
var Schema = mongoose.Schema

var PropertySchema = new Schema({
	propertyName: {
		type: String
	},
	path: {
		type: String,
		default: ''
	},
	propertyType: {
		type: String,
		enum: ENUMS.PROPERTY_TYPES
	},
	group: {
		type: String,
		enum: [ENUMS.PROPERTY_GROUPS.REQUEST,ENUMS.PROPERTY_GROUPS.RESPONSE,ENUMS.PROPERTY_GROUPS.HEADER,ENUMS.PROPERTY_GROUPS.ROUTE]
	},
	mandatory: Boolean,
	description: {
		type: String
	},
	pathOrder: {
		type: Number
	},
	currentChange: {
		type: String,
		enum: [ENUMS.PROPERTY_CHANGE_TYPES.NEW,ENUMS.PROPERTY_CHANGE_TYPES.UPDATE,ENUMS.PROPERTY_CHANGE_TYPES.DELETE,null]
	}
})

export default mongoose.model('Property', PropertySchema)