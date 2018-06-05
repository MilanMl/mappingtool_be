import Router from 'koa-router';
import { ServiceMappingController } from '../controllers/ServiceMappingController';

const router = new Router({prefix: '/api/services/:serviceId/mappings'});

router
    .get('/', ServiceMappingController.getServiceMappings)
    .post('/', ServiceMappingController.addServiceMapping)
    .get('/:mappingId', ServiceMappingController.getServiceMappingById)
    .put('/:mappingId', ServiceMappingController.updateServiceMapping)
    .delete('/:mappingId', ServiceMappingController.deleteServiceMapping)

export default router;