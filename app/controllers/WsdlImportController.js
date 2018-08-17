import CONSTANTS from '../../app/config/constants'
import ENUMS from '../enums'
import { WsdlService } from '../services/WsdlService'
import { StaticFilesService } from '../services/StaticFilesService'
import { PaginatedResult } from '../services/PaginatedResult'
import WsdlImportModel from '../models/importModels/WsdlImportModel'

export const WsdlImportController = {
	addWsdlImport: async function(ctx) {
		try {
			const request = ctx.request.body
			let wsdlModel = new WsdlImportModel()
			wsdlModel.wsdlServiceName = request.wsdlServiceName
			wsdlModel.sourceLink = WsdlService.createWsdlFilePath(request.wsdlServiceName)
			wsdlModel.version = request.version
			const operations = await WsdlService.getWsdlOperations(request.wsdlServiceName)

			operations.map(op => {
				wsdlModel.operations.push(op)
			})

			let savedWsdl = await wsdlModel.save()
			//savedWsdl.sourceLink = getWsdlFilePath(savedWsdl.sourceLink);

			ctx.response.body = savedWsdl
		} catch (e) {
			console.log('Log error: ' + e.name + '(' + e.message + ')')
		}
	},

	getWsdlImports: async function(ctx) {
		let filter = {}
		let paginatedResult = new PaginatedResult(
			ctx.query.pageNumber,
			ctx.query.pageSize
		)

		if (ctx.query.name) {
			filter = { wsdlServiceName: { $regex: '.*' + ctx.query.name + '.*' } }
		}

		try {
			const list = await WsdlImportModel.find(filter)
				.skip((paginatedResult.pageNumber - 1) * paginatedResult.pageSize)
				.limit(paginatedResult.pageSize + 1)
			paginatedResult.setItems(list)
		} catch (e) {
			//console.log('Log error: ' + e.name + '(' + e.message + ')')
		}

		ctx.response.body = paginatedResult.getResult()
	},

	getWsdlImportById: async function(ctx) {
		try {
			ctx.response.body = await WsdlImportModel.findOne({
				_id: ctx.params.wsdlId
			})
		} catch (e) {
			console.error('Log error: ' + e.name + '(' + e.message + ')')
		}
	},

	updateWdlImport: async function(ctx) {
		ctx.response.status = 501
	},

	getTransformedWsdlOperation: async function(ctx) {
		const wsdlId = ctx.params.wsdlId
		const operationId = ctx.params.operationId

		try {
			let wsdl = await WsdlImportModel.findOne({ _id: wsdlId })

			if (wsdl) {
				const tempOp = wsdl.operations.find(op => {
					return op._id == operationId
				})

				if (tempOp) {
					const operationName = tempOp.operationName
					//const StaticFilesService = new StaticFilesService();
					//const wsdlPath = StaticFilesService.getStaticFilePath(wsdl.sourceLink)

					const wsdlFile = await StaticFilesService.getStaticFile(
						wsdl.sourceLink
					)

					const wsdlJson = StaticFilesService.convertXmlFileToJson(wsdlFile)
					const rootPath = CONSTANTS.IMPORTS_FOLDER + wsdl.wsdlServiceName + '/structured/'
					const rootFinalPath = rootPath + wsdlJson.definitions.types.schema.include._attributes.schemaLocation
					const rootXsd = await StaticFilesService.getStaticFile(rootFinalPath)
					const rootXsdJson = StaticFilesService.convertXmlFileToJson(rootXsd)

					// get xsd types in rootXsd
					let typesList = WsdlService.getTypesFromXsd(rootXsdJson)
					// extend types list for each imported xsd
					typesList = await WsdlService.getAllWsdlTypes(rootXsdJson,typesList,rootPath,[])

					const operationDetail = WsdlService.findObjectByAttributeName(operationName,wsdlJson.definitions.portType.operation)
					let requestObject
					let responseObject
					let serviceProperties = []
					//ctx.response.body = typesList
					if (operationDetail) {
						// find request and response within wsdl types lists
						const messageReq = WsdlService.findObjectByAttributeName(operationDetail.input._attributes.message,wsdlJson.definitions.message)
						requestObject = WsdlService.findObjectByAttributeName(messageReq.part._attributes.element,rootXsdJson.schema.element)
						const reqProps = WsdlService.getTransformedPropertiesByGroup(requestObject,typesList,ENUMS.PROPERTY_GROUPS.REQUEST)
						serviceProperties = reqProps

						let messageRes
						let resProps

						if (operationDetail.output) {
							messageRes = WsdlService.findObjectByAttributeName(operationDetail.output._attributes.message,wsdlJson.definitions.message)
							responseObject = WsdlService.findObjectByAttributeName(messageRes.part._attributes.element,rootXsdJson.schema.element)
							resProps = WsdlService.getTransformedPropertiesByGroup(responseObject,typesList,ENUMS.PROPERTY_GROUPS.RESPONSE)
							serviceProperties = reqProps.concat(resProps)
						}
					}

					const service = {
						serviceName: wsdl.wsdlServiceName + '.' + operationName,
						sourceSystem: wsdl.sourceSystem,
						userDefined: false,
						serviceType: ENUMS.SERVICE_TYPES.SOAP,
						properties: serviceProperties
					}

					ctx.response.body = service
				}
			}
		} catch (e) {
			console.log('Log error: ' + e.name + '(' + e.message + ')')
		}
	}
}
