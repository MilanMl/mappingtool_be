import ServiceMapping  from '../models/ServiceMappingModel'
import ServiceModel from '../models/ServiceModel'
import DependencyServiceModel from '../models/DependencyServiceModel'
import {MappingHelper} from '../services/MappingHelper'

const dependencyServicePopulate = { 
    path: 'dependencyServices.service', 
    select: 'serviceName sourceSystem serviceType'
}

const mappingPopulate = {
    path: 'mappedService', 
    select: 'serviceName sourceSystem serviceType'
}

async function addDepencyService(dependency) {
    let dependencyModel = new DependencyServiceModel(dependency)
    dependencyModel.mappedProperties = []
    dependencyModel = await dependencyModel.save()
    return dependencyModel
}

export const ServiceMappingController = {

    addServiceMapping: async function (ctx) {

        try {
            ctx.response.body = await MappingHelper.addServiceMapping(ctx.params.serviceId,ctx.request.body)
        } catch (e) {
            ctx.status = e.statusCode || e.status || 500
            ctx.app.emit('error', e, ctx)
        }
    },

    cloneServiceMapping: async function (ctx) {

        try {
            ctx.response.body = await MappingHelper.cloneServiceMapping(ctx.params.serviceId,ctx.params.mappingId,ctx.request.body)

        } catch(e) {
            ctx.response.status = 400
            ctx.response.body = e.message
        }
    },
    
    getServiceMappings: async function (ctx) {

        let list = []

        try {
            list = await MappingHelper.getServiceMappings(ctx.params.serviceId)

            ctx.response.body = {
                mappings: list    
            }

        } catch (e) {
            ctx.response.status = 400
            ctx.response.body = {message: e.message}
        }        
    }, 

    getServiceMappingById: async function (ctx) {

        try {
            ctx.response.body = await MappingHelper.getServiceMappingById(ctx.params.serviceId,ctx.params.mappingId)
        } catch(e) {
            ctx.response.status = 400
            ctx.response.body = {message: e.message}
        } 
    },

    updateServiceMapping: async function (ctx) {
  
        try {
            ctx.response.body = await MappingHelper.updateServiceMapping(ctx.params.serviceId,ctx.params.mappingId, ctx.request.body)
        } catch (e) {
            console.log(e)
        }
    }, 

    deleteServiceMapping: async function (ctx) {
        ctx.response.status = 501
    }, 

    addMappingDependency: async function (ctx) {
        try {
            ctx.response.body = await MappingHelper.addMappingDependency(ctx.params.serviceId,ctx.params.mappingId,ctx.request.body)
        } catch (e) {
            ctx.status = e.statusCode || e.status || 500
            ctx.app.emit('error', e, ctx)
        }
    },

    getMappingDependencies: async function (ctx) {
        const filter = {
            mappedService: ctx.params.serviceId,
            _id: ctx.params.mappingId
        }
    },

    deleteMappingDependency: async function (ctx) {
        const filter = {
            mappedService: ctx.params.serviceId,
            _id: ctx.params.mappingId
        }
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

        ctx.response.body = response
    }
}