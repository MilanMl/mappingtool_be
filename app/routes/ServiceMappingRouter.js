import Router from 'koa-router'
import { ServiceMappingController } from '../controllers/ServiceMappingController'

const router = new Router({prefix: '/api/services/:serviceId/mappings'})

router
	.get('/', ServiceMappingController.getServiceMappings)
	.post('/', ServiceMappingController.addServiceMapping)
	.get('/:mappingId', ServiceMappingController.getServiceMappingById)
	.put('/:mappingId', ServiceMappingController.updateServiceMapping)
	.delete('/:mappingId', ServiceMappingController.deleteServiceMapping)
	.post('/:mappingId/clone', ServiceMappingController.cloneServiceMapping)
	.get('/:mappingId/dependencies', ServiceMappingController.getServiceMappingById)
	.post('/:mappingId/dependencies', ServiceMappingController.addMappingDependency)
	.delete('/:mappingId/dependencies/:dependencyId', ServiceMappingController.deleteMappingDependency)

export default router