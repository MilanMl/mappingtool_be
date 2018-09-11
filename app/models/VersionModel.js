import mongoose from 'mongoose'

var Schema = mongoose.Schema

var VersionSchema = new Schema({
	name: String,
	releaseDate: Date
})
  
export default mongoose.model('Version', VersionSchema)
