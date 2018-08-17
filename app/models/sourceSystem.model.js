import mongoose from 'mongoose'

var Schema = mongoose.Schema

var SourceSystemSchema = new Schema({
	name: String,
	color: String
})
  
export default mongoose.model('SourceSystem', SourceSystemSchema)
