import mongoose from 'mongoose'

var Schema = mongoose.Schema

var WsdlOperationSchema = new Schema({
	operationName: String,
	serviceDefinition: { type: Boolean, default: true }, 
})
  
export default mongoose.model('WsdlOperation', WsdlOperationSchema)
