import ServiceMapping  from '../models/ServiceMappingModel';
import ServiceModel from '../models/ServiceModel';
import DependencyServiceModel from '../models/DependencyServiceModel';

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
                        const dependency = new DependencyServiceModel(ctx.request.body.dependencyServices[i]);
                        dependency.mappedProperties = []
                        const newDependency = await dependency.save();
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
    
    getServiceMappings: async function (ctx) {

        const filter = { mappedService: ctx.params.serviceId };

        try {
            const list = await ServiceMapping.find(filter)
                .populate('mappedService', 'serviceName sourceSystem serviceType')
                .populate('dependencyServices.service', 'serviceName sourceSystem serviceType')
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
                .populate('mappedService', 'serviceName sourceSystem serviceType')
                .populate('dependencyServices.service', 'serviceName sourceSystem serviceType')
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
            const updatedMapping = await mapping.save()
            const populatedResult = await ServiceMapping.populate(updatedMapping, {path:'dependencyServices.service', select: 'serviceName sourceSystem serviceType'})

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