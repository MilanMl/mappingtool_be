import ServiceMapping  from '../models/ServiceMappingModel'
import ServiceModel from '../models/ServiceModel'
import DependencyServiceModel from '../models/DependencyServiceModel'
import {ServiceHelper} from './ServiceHelper'

export const MappingHelper = (function() {

    const dependencyServicePopulate = { 
        path: 'dependencyServices.service', 
        select: 'serviceName sourceSystem serviceType'
    }
    
    const mappingPopulate = {
        path: 'mappedService', 
        select: 'serviceName sourceSystem serviceType'
    }

    const REDUCED_DEPENDECY_SERVICES_SELECT = '-dependencyServices.mappedProperties'

    return {

        getServiceMappings: async function(serviceId) {
            const filter = { 
                mappedService: serviceId 
            }

            const list = await ServiceMapping.find(filter)
                .populate(mappingPopulate)
                .populate(dependencyServicePopulate)
                .select(REDUCED_DEPENDECY_SERVICES_SELECT)

            return list
        },

        addServiceMapping: async function(serviceId, mapping) {
            const mappedService = await ServiceHelper.getServiceById(serviceId)

            if(mappedService) {

                const dependencyServiceList = []

                // ulozeni samotneho mapovani, respektive use case + jeho dependency services 
                const newMappingObject = {
                    mappedService: serviceId, 
                    mappingName: mapping.mappingName,
                    dependencyServices: dependencyServiceList
                }

                const newMapping = new ServiceMapping(newMappingObject)
                return await newMapping.save()
            } else {
                throw new Error("Service not found")
            }
        },

        getServiceMappingById: async function (serviceId,mappingId) {

            const filter = {
                _id: mappingId,
                mappedService: serviceId
            }
 
            let mapping = await ServiceMapping.findOne(filter)
                .populate(mappingPopulate)
                .populate(dependencyServicePopulate)
                .select(REDUCED_DEPENDECY_SERVICES_SELECT)

            return mapping
        }, 

        updateServiceMapping: async function(serviceId,mappingId,mapping) {

            let editedMapping = await this.getServiceMappingById(serviceId,mappingId)

            if(editedMapping) {
                editedMapping.mappingName = mapping.mappingName
                editedMapping.dependencyServices = mapping.dependencyServices
                editedMapping = await editedMapping.save()

                return await ServiceMapping.populate(mapping, dependencyServicePopulate)
            } else {
                throw new Error("Mapping not found")
            }
        }, 

        cloneServiceMapping: async function(serviceId,mappingId,mapping) {
            let clonedMapping = await this.getServiceMappingById(serviceId,mappingId)
            
            if(clonedMapping) {

                let newMapping = {
                    mappingName: mapping.mappingName,
                    mappedService: clonedMapping.mappedService,
                    dependencyServices: clonedMapping.dependencyServices
                }

                newMapping = new ServiceMapping(newMapping)
                await newMapping.save()

                return await ServiceMapping.populate(newMapping, dependencyServicePopulate)
            } else {
                throw new Error("Mapping not found")
            }
        }, 

        addMappingDependency: async function(serviceId,mappingId,dependency) {
            let mapping = await this.getServiceMappingById(serviceId,mappingId)

            if(mapping) {
                let dependency = new DependencyServiceModel(dependency)
                mapping.dependencyServices.push(dependency)
                return await mapping.save()
            } else {
                throw new Error("Mapping not found")
            }
        }
    }
})()