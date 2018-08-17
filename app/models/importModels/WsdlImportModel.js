import mongoose from 'mongoose'
import WsdlOperation from './wsdlOperation.model'

var Schema = mongoose.Schema

var WsdlSchema = new Schema({
	createDate: { type: Date, default: Date.now },
	wsdlServiceName: String,
	sourceLink: String, 
	version: Number,
	operations: [WsdlOperation.schema]
})
  
export default mongoose.model('Wsdl', WsdlSchema)
