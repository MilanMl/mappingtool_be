import ServiceModel  from '../models/ServiceModel'
import PropertyModel from '../models/PropertyModel'
import CONSTANTS from '../config/constants'
import ENUMS from '../enums'
import {PropertyImportHelper} from './PropertyImportHelper'

export const ServiceHelper = (function() {

	const createPropertyPath = function(propertyName,path) {
		const name = propertyName.replace(/ /g,'')
		const currentPath = path.replace(/ /g,'')
		return (currentPath) ? currentPath + '.' + name : name
	}

	const servicePopulate = {
		path: 'version'
	}

	return {

		addService: async function(service) {
			let newService = new ServiceModel(service)
			newService.createdAt = new Date()
			newService.lastModifiedAt = new Date()
			newService.active = true,
			newService.version = 1

			return await newService.save()
		},

		getServiceList: async function(pageNumber = CONSTANTS.DEFAULT_PAGING.PAGE_NUMBER, pageSize = CONSTANTS.DEFAULT_PAGING.PAGE_SIZE, serviceName = null) {
			let filter = { 
				active: true 
			}
        
			if(serviceName) {

				const searchQuery = new RegExp('.*' + serviceName + '.*', 'i')

				filter = {
					serviceName: { 
						$regex: searchQuery
					} 
				}
			}

			let list = []
            
			list = await ServiceModel.find(filter)
				.populate(servicePopulate)
				.skip((pageNumber - 1) * pageSize)
				.limit(pageSize + 1)

			return list
		},

		getServiceById: async function (serviceId) {
			const filter = {
				_id: serviceId,
				active: true
			}

			return await ServiceModel.findOne(filter)
				.populate(servicePopulate)
		}, 

		updateService: async function(serviceId, service) {

			let editedService = await this.getServiceById(serviceId)

			if(editedService) {
				editedService.serviceName = service.serviceName
				editedService.serviceType = service.serviceType
				editedService.lastModifiedAt = new Date()
				editedService.properties = service.properties
				return await editedService.save()
			} else {
				throw new Error('Service not found')
			}
		}, 

		deleteService: async function(serviceId) {

			let service = await this.getServiceById(serviceId)

			if(service) {
				service.active = false
				await service.save()
			} else {
				throw new Error('Service not found')
			}
		}, 

		addServiceProperty: async function(serviceId,property) {
    
			let service = await this.getServiceById(serviceId)

			if(service) {
				let newProperty = new PropertyModel(property)
				newProperty.propertyName = property.propertyName.replace(/ /g,'')
				newProperty.path = createPropertyPath(newProperty.propertyName, newProperty.path)
				newProperty.currentChange = ENUMS.PROPERTY_CHANGE_TYPES.NEW

				service.properties.push(newProperty)

				return await service.save()
			} else {
				throw new Error('Service not found')
			}
		}, 

		updateServiceProperty: async function(serviceId, propertyId, property) {

			let service = await this.getServiceById(serviceId)

			if(service) {

				let updatedProperty = service.properties.id(propertyId)

				if(updatedProperty === property) {
					return service
				}

				if(updatedProperty) {
					updatedProperty.propertyName = property.propertyName.replace(/ /g,'')
					updatedProperty.path = (property.path !== updatedProperty.path) ? createPropertyPath(property.propertyName, property.path) : property.path
					updatedProperty.propertyType = property.propertyType
					updatedProperty.group = property.group
					updatedProperty.mandatory = property.mandatory
					updatedProperty.description = property.description
					updatedProperty.currentChange = ENUMS.PROPERTY_CHANGE_TYPES.UPDATE
				} else {
					throw new Error('Property not found')
				}

				return await service.save()

			} else {
				throw new Error('Service not found')
			}
		},

		deleteServiceProperty: async function(serviceId, propertyId) {
			let service = await this.getServiceById(serviceId)

			if(service) {

				let removedProperty = service.properties.id(propertyId)

				if(removedProperty) {

					if(removedProperty.propertyType === 'object' || removedProperty.propertyType === 'array') {
						for(let i = 1; i < service.properties.length; i++) {
							if(service.properties[i].path.includes(removedProperty.path)) {
								service.properties[i].currentChange = ENUMS.PROPERTY_CHANGE_TYPES.DELETE
								service.lastModifiedAt = new Date()
							}
						}
					} else {
						removedProperty.currentChange = ENUMS.PROPERTY_CHANGE_TYPES.DELETE
						removedProperty.lastModifiedAt = new Date()
					}
				} else {
					throw new Error('Property not found')
				}

				return await service.save()

			} else {
				throw new Error('Service not found')
			}
		},

		importProperties: async function(serviceId,importObject) {
			let service = await this.getServiceById(serviceId)
    
			if(service) {
				if(service.properties.length === 0) {
					let propertyImportHelper = new PropertyImportHelper(importObject.exampleObject,importObject.group)
					service.properties = propertyImportHelper.createProperties()
				} else {
					throw new Error('Properties exists within current service')
				}

				return await service.save()
			} else {
				throw new Error('Service not found')
			}
		}
	}
})()