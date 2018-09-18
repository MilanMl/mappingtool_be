import {ServiceHelper} from '../services/ServiceHelper'
import {PaginatedResult} from '../services/PaginatedResult'

export const ServiceController = {

	addService: async function (ctx) {

		try {
			ctx.response.body = await ServiceHelper.addService(ctx.request.body)
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}

	},
    
	getServices: async function (ctx) {

		let paginatedResult = new PaginatedResult(ctx.query.pageNumber,ctx.query.pageSize)

		try {
			let list = await ServiceHelper.getServiceList(paginatedResult.pageNumber,paginatedResult.pageSize,ctx.query.name)
			paginatedResult.setItems(list)
			ctx.response.body = paginatedResult.getResult()
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	},

	getServiceDetail: async function (ctx) {

		try {
			ctx.response.body = await ServiceHelper.getServiceById(ctx.params.serviceId)
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	},

	updateService: async function (ctx) {

		try {
			ctx.response.body = await ServiceHelper.updateService(ctx.params.serviceId,ctx.request.body)
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	}, 

	deleteService: async function (ctx) {

		try {
			await ServiceHelper.deleteService(ctx.params.serviceId)
			ctx.response.status = 200
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	}, 

	getServiceProperties: async function (ctx) {
		ctx.response.status = 501
	},
    
	importProperties: async function (ctx) {

		try {
			ctx.response.status = 200
			ctx.response.body = await ServiceHelper.importProperties(ctx.params.serviceId, ctx.request.body)
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	},

	addServiceProperty: async function (ctx) {
     
		try {
			ctx.response.body = await ServiceHelper.addServiceProperty(ctx.params.serviceId,ctx.request.body)
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	}, 

	getServicePropertyById: async function (ctx) {
		ctx.response.status = 501
	},

	updateServiceProperty: async function (ctx) {

		try {
			ctx.response.body = await ServiceHelper.updateServiceProperty(ctx.params.serviceId,ctx.params.propertyId,ctx.request.body)
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	},

	deleteServiceProperty: async function (ctx) {

		try {
			ctx.response.body = await ServiceHelper.deleteServiceProperty(ctx.params.serviceId,ctx.params.propertyId)
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	},

	unmarkPropertyChange: async function (ctx) {

		try {
			ctx.response.body = await ServiceHelper.unmarkPropertyChange(ctx.params.serviceId,ctx.params.propertyId)
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	},
}