var Schema = mongoose.Schema;
var Property = require('./PropertyModel');
var SourceSystem = require('./sourceSystem.model');

import mongoose from 'mongoose';
import ENUMS from '../enums';

var ServiceSchema = new Schema({
  serviceName: {
    type: String
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
    type: String
  },
  userDefined: Boolean,
  createdAt: Date,
  createdBy: String,
  lastModifiedAt: Date,
  lastModifiedBy: String,
  active: Boolean,
  properties: [Property.schema]
}, {usePushEach: true});

module.exports = mongoose.model('Service', ServiceSchema);