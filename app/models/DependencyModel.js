import mongoose from 'mongoose'

var Schema = mongoose.Schema

var DependencySchema = new Schema({
	dependencyType: {
		type: String, 
		enum: ['property','codetable','const']
	},
	codetable: {
		codetable: String,
		value: String
	},
	const: String,
	description: String
})

export default mongoose.model('Dependency', DependencySchema)