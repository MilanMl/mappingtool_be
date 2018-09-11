import {VersionHelper} from '../services//VersionHelper'

export const VersionController = {

	addVersion: async function (ctx) {

		try {
			ctx.response.body = await VersionHelper.addVersion(ctx.request.body)
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}

	},
    
	getVersions: async function (ctx) {
		try {
			ctx.response.body = await VersionHelper.getVersionsList(ctx.query.name)
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	},

	getVersionDetail: async function (ctx) {

		try {
			ctx.response.body = await VersionHelper.getVersionById(ctx.params.serviceId)
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	},

	updateVersion: async function (ctx) {

		try {
			ctx.response.body = await VersionHelper.updateVersion(ctx.params.serviceId,ctx.request.body)
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	}, 

	deleteVersion: async function (ctx) {

		try {
			await VersionHelper.deleteVersion(ctx.params.serviceId)
			ctx.response.status = 200
		} catch (e) {
			ctx.status = e.statusCode || e.status || 500
			ctx.app.emit('error', e, ctx)
		}
	}
}