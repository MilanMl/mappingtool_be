import Router from 'koa-router';
import combineRouters from 'koa-combine-routers';

import wsdlImportRouter from './WsdlImportRouter';
import serviceRouter from './ServiceRouter';
import systemsRouter from './sourceSystem.router';
import mappingRouter from './ServiceMappingRouter';
import serviceDependenciesRouter from './ServiceDependenciesRouter';

const router = combineRouters([
  wsdlImportRouter,
  mappingRouter,
  serviceRouter,
  systemsRouter,
  serviceDependenciesRouter
])

export default router;