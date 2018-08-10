import Router from 'koa-router';
import { ServiceDependenciesController } from '../controllers/ServiceDependenciesController';

const router = new Router({prefix: '/api/dependencies'});

router
    .post('/:dependencyId/properties/', ServiceDependenciesController.addPropertyMapping)
    .get('/:dependencyId', ServiceDependenciesController.getServiceDependencyById)
    .put('/:dependencyId', ServiceDependenciesController.updateServiceDependency)
    .delete('/:dependencyId', ServiceDependenciesController.deleteServiceDependency)
    .post('/:dependencyId/properties/', ServiceDependenciesController.addPropertyMapping)
    .get('/:dependencyId/properties/:propertyId', ServiceDependenciesController.getPropertyMapping)
    .put('/:dependencyId/properties/:propertyId', ServiceDependenciesController.updatePropertyMapping)
    .delete('/:dependencyId/properties/:propertyId', ServiceDependenciesController.deletePropertyMapping)

export default router;