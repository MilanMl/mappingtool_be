import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var WsdlOperationSchema = new Schema({
    operationName: String,
    serviceDefinition: { type: Boolean, default: true }, 
});
  
module.exports = mongoose.model('WsdlOperation', WsdlOperationSchema);
