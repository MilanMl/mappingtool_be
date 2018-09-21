import convert from 'xml-js'
import axios from 'axios'
import { Application } from '../config/application'
import CONSTANTS from '../../app/config/constants'
import wsdlHelper from './WsdlHelper'
import ENUMS from '../enums'
import WsdlImportModel from '../models/importModels/WsdlImportModel'

export const ImportServices = (function() {
	return {
		addWsdlImport: async function(wsdl) {
			let wsdlModel = new WsdlImportModel()
			wsdlModel.wsdlServiceName = wsdl.wsdlServiceName
			wsdlModel.sourceLink = createWsdlFilePath(wsdl.wsdlServiceName)
			wsdlModel.version = wsdl.version

			const operations = await this.getWsdlOperations(wsdl.wsdlServiceName)

			operations.map(op => {
				wsdlModel.operations.push(op)
			})

			let savedWsdl = await wsdlModel.save()
			savedWsdl.sourceLink = getWsdlFilePath(savedWsdl.sourceLink)

			return savedWsdl
		},

		getWsdlImports: async function() {
			return await WsdlImportModel.find()
		},

		getWsdlImportById: async function(wsdlId) {
			let wsdl = null
			try {
				wsdl = await WsdlImportModel.findOne({ _id: wsdlId })
			} catch (e) {
				console.log(
					'[' +
            ImportServices.getWsdlImportById.name +
            '] ' +
            e.name +
            ' (' +
            e.kind +
            ') with value ' +
            e.value
				)
			}
			return wsdl
		},

		updateWsdlImport: async function(wsdl) {
			return wsdl
		},

		getTransformedWsdlOperation: async function(wsdlId, operationId) {
			let wsdl = await this.getWsdlImportById(wsdlId)
			let operationName
			if (wsdl) {
				const tempOp = wsdl.operations.find(op => {
					return op._id == operationId
				})

				if (tempOp) {
					operationName = tempOp.operationName
					const wsdlPath = getWsdlFilePath(wsdl.sourceLink)

					// load wsdl
					let wsdlJson = await getFile(wsdlPath)

					// load rootXsd
					const rootPath =
            Application.getCurrentHost() +
            CONSTANTS.IMPORTS_FOLDER +
            wsdl.wsdlServiceName +
            '/structured/'
					let rootXsdPath =
            wsdlJson.definitions.types.schema.include._attributes
            	.schemaLocation
					let rootXsd = await getFile(rootPath + rootXsdPath)

					// get xsd types in rootXsd
					let typesList = wsdlHelper.getAllTypes(rootXsd)

					// extend types list for each imported xsd
					typesList = await createXsdTypeList(rootXsd, typesList, rootPath, [])

					const operationDetail = wsdlHelper.findObjectByAttributeName(
						operationName,
						wsdlJson.definitions.portType.operation
					)
					let requestObject
					let responseObject
					let serviceProperties = []

					if (operationDetail) {
						// find request and response wsdl objects
						let messageReq = wsdlHelper.findObjectByAttributeName(
							operationDetail.input._attributes.message,
							wsdlJson.definitions.message
						)
						requestObject = wsdlHelper.findObjectByAttributeName(
							messageReq.part._attributes.element,
							rootXsd.schema.element
						)
						const reqProps = wsdlHelper.getProperties(
							requestObject,
							typesList,
							ENUMS.PROPERTY_GROUPS.REQUEST
						)
						serviceProperties = reqProps

						let messageRes
						let resProps
						if (operationDetail.output) {
							messageRes = wsdlHelper.findObjectByAttributeName(
								operationDetail.output._attributes.message,
								wsdlJson.definitions.message
							)
							responseObject = wsdlHelper.findObjectByAttributeName(
								messageRes.part._attributes.element,
								rootXsd.schema.element
							)
							resProps = wsdlHelper.getProperties(
								responseObject,
								typesList,
								ENUMS.PROPERTY_GROUPS.RESPONSE
							)
						}
						serviceProperties = reqProps.concat(resProps)
					}

					const service = {
						serviceName: wsdl.wsdlServiceName,
						sourceSystem: wsdl.sourceSystem,
						userDefined: false,
						serviceType: ENUMS.SERVICE_TYPES.SOAP,
						properties: serviceProperties
					}

					return service
				}
			}

			return null
		},

		createWsdlService: async function(wsdlName, operationName) {
			const wsdlPath = getWsdlPath(wsdlName)
			const rootPath =
        Application.getCurrentHost() +
        CONSTANTS.IMPORTS_FOLDER +
        wsdlName +
        '/structured/'
			console.log(wsdlPath)
			// load wsdl
			let wsdlJson = await getFile(wsdlPath)

			let rootXsdPath =
        wsdlJson.definitions.types.schema.include._attributes.schemaLocation

			// load rootXsd
			let rootXsd = await getFile(rootPath + rootXsdPath)

			// get xsd types in rootXsd
			let typesList = wsdlHelper.getAllTypes(rootXsd)

			// create all types list
			typesList = await createXsdTypeList(rootXsd, typesList, rootPath, [])

			// get operation
			const operation = await this.getWsdlOperationDetail(
				wsdlName,
				operationName
			)

			let requestObject
			let responseObject
			let serviceProperties = []
			if (operation) {
				// find request and response wsdl objects
				let messageReq = wsdlHelper.findObjectByAttributeName(
					operation.input._attributes.message,
					wsdlJson.definitions.message
				)
				requestObject = wsdlHelper.findObjectByAttributeName(
					messageReq.part._attributes.element,
					rootXsd.schema.element
				)
				const reqProps = wsdlHelper.getProperties(
					requestObject,
					typesList,
					ENUMS.PROPERTY_GROUPS.REQUEST
				)
				serviceProperties = reqProps

				let messageRes
				let resProps
				if (operation.output) {
					messageRes = wsdlHelper.findObjectByAttributeName(
						operation.output._attributes.message,
						wsdlJson.definitions.message
					)
					responseObject = wsdlHelper.findObjectByAttributeName(
						messageRes.part._attributes.element,
						rootXsd.schema.element
					)
					resProps = wsdlHelper.getProperties(
						responseObject,
						typesList,
						ENUMS.PROPERTY_GROUPS.RESPONSE
					)
				}

				serviceProperties = reqProps.concat(resProps)
			}

			return serviceProperties
		},

		getWsdlOperations: async function(wsdlName) {
			console.log(66)
			const wsdlPath = getWsdlPath(wsdlName)
			console.log(66)
			let wsdlJson = await getFile(wsdlPath)

			let operations = []

			for (let i = 0; i < wsdlJson.definitions.portType.operation.length; i++) {
				operations.push({
					operationName:
            wsdlJson.definitions.portType.operation[i]._attributes.name
				})
			}

			return operations
		},

		getWsdlOperationDetail: async function(wsdlName, operationName) {
			const wsdlPath = getWsdlPath(wsdlName)
			let wsdlJson = await getFile(wsdlPath)

			return wsdlHelper.findObjectByAttributeName(
				operationName,
				wsdlJson.definitions.portType.operation
			)
		}
	}
})()

function getWsdlPath(wsdlName) {
	return (
		Application.getCurrentHost() +
    CONSTANTS.IMPORTS_FOLDER +
    wsdlName +
    '/structured/' +
    wsdlName +
    '.wsdl'
	)
}

function createWsdlFilePath(wsdlName) {
	return wsdlName + '/structured/' + wsdlName + '.wsdl'
}

function convertXmlToJson(xml) {
	xml = convert.xml2json(xml, { compact: true, spaces: 4 })
	return JSON.parse(xml)
}

function getWsdlFilePath(sourceLink) {
	return Application.getCurrentHost() + CONSTANTS.IMPORTS_FOLDER + sourceLink
}

function removeXmlTagsPart(xmlContent) {
	xmlContent = xmlContent.replace(/wsdl:/g, '')
	xmlContent = xmlContent.replace(/xsd:/g, '')
	xmlContent = xmlContent.replace(/wsp:/g, '')
	xmlContent = xmlContent.replace(/xmlns:/g, '')

	return xmlContent
}

async function getFile(url) {
	try {
		let response = await axios.get(url)
		response = response.data
		response = removeXmlTagsPart(response)
		response = convertXmlToJson(response)
		return response
	} catch (e) {
		console.log(
			'[' +
        getFile.name +
        '] ' +
        e.name +
        ' (' +
        e.kind +
        ') with value ' +
        e.value
		)
	}
}

async function createXsdTypeList(
	xsd,
	currentTypeList,
	rootPath,
	schemaLocations = []
) {
	if (xsd.schema.import) {
		for (let i = 0; i < xsd.schema.import.length; i++) {
			if (
				schemaLocations.includes(
					xsd.schema.import[i]._attributes.schemaLocation
				)
			) {
				continue
			}

			const path = xsd.schema.import[i]._attributes.schemaLocation.replace(
				'../',
				''
			)
			schemaLocations.push(xsd.schema.import[i]._attributes.schemaLocation)
			const loadedXsd = await getFile(rootPath + path)
			const importedTypeList = wsdlHelper.getAllTypes(loadedXsd)
			currentTypeList = currentTypeList.concat(importedTypeList)

			currentTypeList = await createXsdTypeList(
				loadedXsd,
				currentTypeList,
				rootPath,
				schemaLocations
			)
		}
	}

	return currentTypeList
}
