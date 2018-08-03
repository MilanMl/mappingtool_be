import ServiceMapping  from '../models/ServiceMappingModel';
import ServiceModel from '../models/ServiceModel';
import DependencyServiceModel from '../models/DependencyServiceModel';

const dependencyServicePopulate = { 
    path: 'dependencyServices.service', 
    select: 'serviceName sourceSystem serviceType'
}

const mappingPopulate = {
    path: 'mappedService', 
    select: 'serviceName sourceSystem serviceType'
}

async function addDepencyService(dependency) {
    let dependencyModel = new DependencyServiceModel(dependency);
    dependencyModel.mappedProperties = []
    dependencyModel = await dependencyModel.save();
    return dependencyModel
}


export const ServiceMappingController = {

    addServiceMapping: async function (ctx) {

        const filter = {
            _id: ctx.params.serviceId,
            active: true
        }

        try {
            const mappedService = await ServiceModel.findOne(filter);

            if(mappedService) {

                const dependencyServiceList = [];

                if(mappedService.dependencyServices) {
                    // zalozeni dependency services
                    for(let i = 0; i < ctx.request.body.dependencyServices.length; i++) {
                        const newDependency = await addDepencyService(ctx.request.body.dependencyServices[i]);
                        dependencyServiceList.push(newDependency)
                    }
                }

                // ulozeni samotneho mapovani, respektive use case + jeho dependency services 
                const newMappingObject = {
                    mappedService: ctx.params.serviceId, 
                    mappingName: ctx.request.body.mappingName,
                    dependencyServices: dependencyServiceList
                }

                const newMapping = new ServiceMapping(newMappingObject);
                await newMapping.save();

                ctx.response.body = newMapping;

            } else {
                throw "Service not found";
            }
        } catch (e) {
            ctx.response.status = 400;
            ctx.response.body = e.message;
        }

    },

    cloneServiceMapping: async function (ctx) {

        // dodelat vznik DependencyServiceModel
        const filter = {
            _id: ctx.params.mappingId,
            mappedService: ctx.params.serviceId
        }

        try {
            let mapping = await ServiceMapping.findOne(filter)
            
            if(mapping) {

                let clonedMapping = {
                    mappingName: ctx.request.body.mappingName,
                    mappedService: mapping.mappedService,
                    dependencyServices: mapping.dependencyServices
                }

                clonedMapping = new ServiceMapping(clonedMapping);
                await clonedMapping.save();
                clonedMapping = await ServiceMapping.populate(clonedMapping, dependencyServicePopulate)

                ctx.response.body = clonedMapping;
            } else {
                throw "Service or cloned mapping not found";
            }

        } catch(e) {
            ctx.response.status = 400;
            ctx.response.body = e.message;
        }
    },
    
    getServiceMappings: async function (ctx) {

        const filter = { mappedService: ctx.params.serviceId };

        try {
            const list = await ServiceMapping.find(filter)
                .populate(mappingPopulate)
                .populate(dependencyServicePopulate)
                .select('-dependencyServices.mappedProperties');

            ctx.response.body = {
                mappings: list    
            }

        } catch (e) {
            ctx.response.status = 400;
            ctx.response.body = e.message;
        }        
    }, 

    getServiceMappingById: async function (ctx) {
        const filter = {
            _id: ctx.params.mappingId,
            mappedService: ctx.params.serviceId
        }

        try {

            let mapping = await ServiceMapping.findOne(filter)
                .populate(mappingPopulate)
                .populate(dependencyServicePopulate)
                .select('-dependencyServices.mappedProperties');

            ctx.response.body = mapping;

        } catch (e) {
            console.log(e)
        }
    },

    updateServiceMapping: async function (ctx) {
        const filter = {
            _id: ctx.params.mappingId,
            mappedService: ctx.params.serviceId
        }

        try {

            let mapping = await ServiceMapping.findOne(filter);
            mapping.mappingName = ctx.request.body.mappingName;
            mapping.dependencyServices = ctx.request.body.dependencyServices;

            /*
            if(mapping.dependencyServices) {
                // zalozeni dependency services
                for(let i = 0; i < mapping.dependencyServices.length; i++) {
                    addDepencyService(mapping.dependencyServices[i]);
                }
            }
            */

            mapping = await mapping.save()
            const populatedResult = await ServiceMapping.populate(mapping, dependencyServicePopulate)

            ctx.response.body = populatedResult;

        } catch (e) {
            console.log(e)
        }
    }, 

    deleteServiceMapping: async function (ctx) {
        
    }, 

    getServiceMappingDetail: async function (ctx) {

        const response = {
            properties: [
                {
                    propertyId: "asdas",
                    serviceMapping: "asdasdjklaskj",
                    description: "nejaky text",
                    mandatory: false, 
                    dependecies: [
                        {
                            dependencyId: "sadas",
                            dependencyType: "SERVICE",
                            service: {
                                _id: "asda",
                                serviceName: "asda",
                                serviceType: "REST",
                                sourceSystem: "WBL"
                            },
                            property: {
                                propertyId: "asdaklsdlk",
                                propertyName: "aslkdkl",
                                propertyPath: "aaa.bbb"
                            }
                        },
                        {
                            dependencyId: "sadas",
                            dependencyType: "ENUM",
                            enum: {
                                name: "CB_xxx",
                                value: "666"
                            }
                        },
                        {
                            dependencyId: "sadas",
                            dependencyType: "CONST",
                            const: 666
                        },
                    ]   
                }
            ]
        }

        ctx.response.body = response;
    }
}