import mongoose from 'mongoose';
var Dependency = require('./DependencyModel');

var Schema = mongoose.Schema;

var PropertyMappingSchema = new Schema({
    propertyId: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    description: {
        type: String
    },
    mandatory: {
        type: Boolean
    },
    dependencies: {
        type: [Dependency.schema],
        default: []
    }
}, { _id: false });

module.exports = mongoose.model('PropertyMapping', PropertyMappingSchema)

/*

{
    serviceId: 666;
    propertyId: 777;
    dependencies: [
        {
            direction: "in",
            type: "codetable", 
        }
    ]
}

{
    dependencyServices: [
        {
            service: {}
        }
    ]
}


{
    createAt: "asdjkas";
    createBy: "jasdjkkas";
    serviceId: "asjdjkas";
    lastModifiedAt: "asdjkasj";
    lastModifiedBy: "askdjka";
    mapping: [
        {
            propertyId: "asdjsa",
            description: "asjdkj", 
            dependecies: [
                {
                    direction: "in",
                    type: "codetable",
                    value: "a",
                    serviceId: "asd", 
                    propertyId: "asdjkjas"
                }
            ]
        }
    ]
}

*/