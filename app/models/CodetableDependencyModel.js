import mongoose from 'mongoose'

var Schema = mongoose.Schema

var CodetableDependencySchema = new Schema({
	codetable: { 
		type: String
	},
	value: { 
		type: String
	}
})

export default mongoose.model('CodetableDependency', CodetableDependencySchema)