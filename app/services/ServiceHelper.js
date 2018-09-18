import ServiceModel  from '../models/ServiceModel'
import PropertyModel from '../models/PropertyModel'
import CONSTANTS from '../config/constants'
import ENUMS from '../enums'
import {PropertyImport} from '../models/PropertyImport'
import {VersionHelper} from './VersionHelper'

export const ServiceHelper = (function() {

	// vytvoreni novou cestu k property
	const createPropertyPath = function(propertyName,path) {
		const name = propertyName.replace(/ /g,'')
		const currentPath = path.replace(/ /g,'')
		return (currentPath) ? currentPath + '.' + name : name
	}

	// vrati prvni nasledujici index atributu v objektu / poli 
	// napr - objekt nekde v properties ma dva parametry, funkce vrati poradi pro dalsi parametr = 3 
	const getNextIndex = function(properties,currentProperty) {
		const pathNestingCount = getNestingCount(currentProperty.path) + 1

		const currentObjectProps = properties.filter((property) => {
			return property.path.includes(currentProperty.path) && 
				getNestingCount(property.path) === pathNestingCount && 
				property.group === currentProperty.group
		})

		let lastIndex = properties.findIndex((property) => {
			return (property._id === currentObjectProps[currentObjectProps.length - 1]._id)
		})

		return lastIndex + 1
	}

	// vrati pocet zanoreni dane cesty
	const getNestingCount = function(path) {
		return ( path.match( RegExp('\\.','g') ) || [] ).length
	}

	
	const isComplexType = function(property) {
		return (property.propertyType === 'object' || property.propertyType === 'array') ? true : false
	}

	const servicePopulate = {
		path: 'version'
	}

	return {

		addService: async function(service) {
			let newService = new ServiceModel(service)
			newService.createdAt = new Date()
			newService.lastModifiedAt = new Date()
			newService.active = true

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

		updateService: async function(serviceId, editedService) {

			let service = await this.getServiceById(serviceId)

			if(!service) {
				throw new Error('Service not found')
			}

			service.serviceName = editedService.serviceName
			service.serviceType = editedService.serviceType
			service.lastModifiedAt = new Date()
			service.properties = editedService.properties
			service.version = editedService.version

			await service.save()

			if(service.version !== editedService.version) {
				service.version = await VersionHelper.getVersionById(editedService.version)
			}

			return service
		}, 

		deleteService: async function(serviceId) {

			let service = await this.getServiceById(serviceId)

			if(!service) {
				throw new Error('Service not found')
			}

			service.active = false
			await service.save()
		}, 

		addServiceProperty: async function(serviceId,property) {
    
			let service = await this.getServiceById(serviceId)

			if(!service) {
				throw new Error('Service not found')
			}

			let newProperty = new PropertyModel(property)
			newProperty.propertyName = property.propertyName.replace(/ /g,'')
			newProperty.path = createPropertyPath(newProperty.propertyName, newProperty.path)
			newProperty.currentChange = ENUMS.PROPERTY_CHANGE_TYPES.NEW

			const propIndex = getNextIndex(service.properties, property)
			service.properties.splice(propIndex,0,newProperty)

			return await service.save()
		}, 

		updateServiceProperty: async function(serviceId, propertyId, property) {

			let service = await this.getServiceById(serviceId)

			if(!service) {
				throw new Error('Service not found')
			}

			let updatedProperty = service.properties.id(propertyId)

			if(!updatedProperty) {
				throw new Error('Property not found')
			}

			if(updatedProperty === property) {
				return service
			}

			// dodelat zmenu serazeni service.properties kdyz se zmeni umisteni 
			updatedProperty.propertyName = property.propertyName.replace(/ /g,'')
			updatedProperty.path = (property.path !== updatedProperty.path) ? createPropertyPath(property.propertyName, property.path) : property.path
			updatedProperty.propertyType = property.propertyType
			updatedProperty.group = property.group
			updatedProperty.mandatory = property.mandatory
			updatedProperty.description = property.description
			updatedProperty.currentChange = ENUMS.PROPERTY_CHANGE_TYPES.UPDATE

			return await service.save()
		},

		deleteServiceProperty: async function(serviceId, propertyId) {
			let service = await this.getServiceById(serviceId)

			if(!service) {
				throw new Error('Service not found')
			}

			let removedProperty = service.properties.id(propertyId)

			if(!removedProperty) {
				throw new Error('Property not found')
			}

			// pokud je uz marknuta jako delete, pak odstranit z db, pokud ne, tak jen mark (currentChange)
			if(removedProperty.currentChange !== ENUMS.PROPERTY_CHANGE_TYPES.DELETE) {
				if(isComplexType(removedProperty)) {
					for(let i = 1; i < service.properties.length; i++) {
						if(service.properties[i].path.includes(removedProperty.path)) {
							service.properties[i].currentChange = ENUMS.PROPERTY_CHANGE_TYPES.DELETE
						}
					}
				} else {
					removedProperty.currentChange = ENUMS.PROPERTY_CHANGE_TYPES.DELETE
				}
			} else {
				service.properties = service.properties.filter((property) => {
					return !property.path.includes(removedProperty.path)
				})
			}

			service.lastModifiedAt = new Date()

			return await service.save()
		},

		importProperties: async function(serviceId,importObject) {
			let service = await this.getServiceById(serviceId)

			if(!service) {
				throw new Error('Service not found')
			}

			let propertyImportHelper = new PropertyImport(importObject.exampleObject,importObject.group)
			service.properties = service.properties.concat(propertyImportHelper.createProperties())

			return await service.save()
		}, 

		unmarkPropertyChange: async function(serviceId,propertyId) {
			let service = await this.getServiceById(serviceId)

			if(!service) {
				throw new Error('Service not found')
			}

			let updatedProperty = service.properties.id(propertyId)

			if(!updatedProperty) {
				throw new Error('Property not found')
			}

			updatedProperty.currentChange = null

			return await service.save()
		}
	}
})()