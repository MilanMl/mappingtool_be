import ServiceDependency  from '../models/DependencyServiceModel';

export const ServiceDependencyHelper = (function() {

    const dependencyServicePopulate = { 
        path: 'service', 
        select: 'serviceName sourceSystem serviceType'
    }

    return {
        getDependencyById: async function(dependencyId) {

            const filter = {
                _id: dependencyId
            }
    
            return await ServiceDependency.findOne(filter).populate(dependencyServicePopulate);
        }
    }
})()