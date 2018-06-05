import ServiceDependency  from '../models/DependencyServiceModel';
import PropertyMapping  from '../models/PropertyMappingModel';
import Dependency from '../models/DependencyModel';

export const ServiceDependenciesController = {

    getServiceDependencyById: async function (ctx) {
        
        const filter = {
            _id: ctx.params.dependencyId
        }

        const dependency = await ServiceDependency.findOne(filter);
        ctx.response.body = dependency

    },
    
    updateServiceDependency: async function (ctx) {
      
    }, 

    deleteServiceDependency: async function (ctx) {
        
    },

    addPropertyMapping: async function (ctx) {

        const filter = {
            _id: ctx.params.dependencyId
        }

        let mappedProperty = ctx.request.body;

        try {
            let Dependency = await ServiceDependency.findOne(filter);
            let searchedProperty = Dependency.mappedProperties.find((property) => {
                return property.propertyId == mappedProperty.propertyId
            });

            if(searchedProperty) {
                throw new Error("Dependency with propertyId: "+ ctx.request.body.propertyId + " already exists.");
            }

            Dependency.mappedProperties.push(mappedProperty);
            ctx.response.body = await Dependency.save();
        } catch (e) {
            ctx.response.status = 400;
            ctx.response.body = e.message;
        }
    }, 

    getPropertyMapping: async function (ctx) {
        const filter = {
            _id: ctx.params.dependencyId
        }

        try {
            const dependency = await ServiceDependency.findOne(filter);
            ctx.response.body = dependency.mappedProperties.find((property) => {
                return property.propertyId = ctx.params.propertyId
            })
        } catch (e) {
            ctx.response.status = 400;
            ctx.response.body = e.message;
        }
    }, 

    updatePropertyMapping: async function (ctx) {
        const filter = {
            _id: ctx.params.dependencyId, 
            propertyId: ctx.params.propertyId
        }
    }, 

    deletePropertyMapping: async function (ctx) {
        const filter = {
            _id: ctx.params.dependencyId, 
            propertyId: ctx.params.propertyId
        }
    }
}