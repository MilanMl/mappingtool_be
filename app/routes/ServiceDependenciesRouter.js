import Router from 'koa-router';
import { ServiceDependenciesController } from '../controllers/ServiceDependenciesController';

const router = new Router({prefix: '/api/dependencies/:dependencyId'});

router
    .get('/', ServiceDependenciesController.getServiceDependencyById)
    .put('/', ServiceDependenciesController.updateServiceDependency)
    .delete('/', ServiceDependenciesController.deleteServiceDependency)
    .post('/properties/', ServiceDependenciesController.addPropertyMapping)
    .get('/properties/:propertyId', ServiceDependenciesController.getPropertyMapping)
    .put('/properties/:propertyId', ServiceDependenciesController.updatePropertyMapping)
    .delete('/properties/:propertyId', ServiceDependenciesController.deletePropertyMapping)

export default router;