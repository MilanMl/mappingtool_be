import ServiceDependency  from '../models/DependencyServiceModel'
import { ServiceDependencyHelper } from '../services/ServiceDependencyHelper'

export const ServiceDependenciesController = {

	getServiceDependencyById: async function (ctx) {
        
		try {
			ctx.response.body = await ServiceDependencyHelper.getDependencyById(ctx.params.dependencyId)
			ctx.response.status = 200
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}

	},

	addPropertyMapping: async function (ctx) {

		const filter = {
			_id: ctx.params.dependencyId
		}
        
		let mappedProperty = ctx.request.body

		try {
			let Dependency = await ServiceDependency.findOne(filter)
			let searchedProperty = Dependency.mappedProperties.find((property) => {
				return property.propertyId == mappedProperty.propertyId
			})

			if(searchedProperty) {
				throw new Error('Dependency with propertyId: ' + ctx.request.body.propertyId + ' already exists.')
			}

			Dependency.mappedProperties.push(mappedProperty)
			ctx.response.body = await Dependency.save()
		} catch (e) {
			ctx.response.status = 400
			ctx.response.body = e.message
		}
	}, 

	getPropertyMapping: async function (ctx) {
		const filter = {
			_id: ctx.params.dependencyId
		}

		try {
			const dependency = await ServiceDependency.findOne(filter)
			ctx.response.body = dependency.mappedProperties.find((property) => {
				return property.propertyId = ctx.params.propertyId
			})
		} catch (e) {
			ctx.response.status = 400
			ctx.response.body = e.message
		}
	}, 

	updateServiceDependency: async function(ctx) {
		ctx.response.status = 501
	},

	deleteServiceDependency: async function(ctx) {
		ctx.response.status = 501
	},

	updatePropertyMapping: async function(ctx) {
		ctx.response.status = 501
	}, 

	deletePropertyMapping: async function(ctx) {
		ctx.response.status = 501
	}
}