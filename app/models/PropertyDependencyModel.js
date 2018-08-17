import mongoose from 'mongoose'
var Schema = mongoose.Schema

var PropertyDependencySchema = new Schema({
	serviceMapping: {
		type: Schema.Types.ObjectId, 
		ref: 'ServiceMapping' 
	},
	propertyId: {
		type: Schema.Types.ObjectId, 
		ref: 'Property' 
	},
	description: {
		type: String
	},
	mandatory: {
		type: Boolean
	}
})

export default mongoose.model('PropertyDependency', PropertyDependencySchema)

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