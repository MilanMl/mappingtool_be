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
    .get('/:serviceId/properties', ServiceController.getServiceProperties)
    .post('/:serviceId/properties', ServiceController.addServiceProperty)
    .post('/:serviceId/properties/import', ServiceController.importProperties)
    .get('/:serviceId/properties/:propertyId', ServiceController.getServicePropertyById)
    .put('/:serviceId/properties/:propertyId', ServiceController.updateServiceProperty)
    .delete('/:serviceId/properties/:propertyId', ServiceController.deleteServiceProperty)

export default router;