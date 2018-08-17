import combineRouters from 'koa-combine-routers'

import wsdlImportRouter from './WsdlImportRouter'
import serviceRouter from './ServiceRouter'
import mappingRouter from './ServiceMappingRouter'
import serviceDependenciesRouter from './ServiceDependenciesRouter'

const router = combineRouters([
	wsdlImportRouter,
	mappingRouter,
	serviceRouter,
	serviceDependenciesRouter
])

export default router