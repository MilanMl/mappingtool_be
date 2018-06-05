import Router from 'koa-router';
import { ServiceController } from '../controllers/ServiceController';
import { ServiceMappingController } from '../controllers/ServiceMappingController';

const router = new Router({prefix: '/api/services'});

router
    .get('/', ServiceController.getServices)
    .post('/', ServiceController.addService)
    .get('/:serviceId', ServiceController.getServiceDetail)
    .put('/:serviceId', ServiceController.updateService)
    .delete('/:serviceId', ServiceController.deleteService)

    /*
    .get('/:serviceId/mappings', ServiceMappingController.getServiceMappings)
    .post('/:serviceId/mappings', ServiceMappingController.addServiceMapping)
    .get('/:serviceId/mappings/:mappingId', ServiceMappingController.getServiceMappingById)
    .put('/:serviceId/mappings/:mappingId', ServiceMappingController.updateServiceMapping)
    .delete('/:serviceId/mappings/:mappingId', ServiceMappingController.deleteServiceMapping)
    */

export default router;