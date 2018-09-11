import combineRouters from 'koa-combine-routers'

import wsdlImportRouter from './WsdlImportRouter'
import serviceRouter from './ServiceRouter'
import mappingRouter from './ServiceMappingRouter'
import serviceDependenciesRouter from './ServiceDependenciesRouter'
import versionRouter from './versionRouter'

const router = combineRouters([
	wsdlImportRouter,
	mappingRouter,
	serviceRouter,
	versionRouter,
	serviceDependenciesRouter
])

export default router