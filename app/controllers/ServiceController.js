import ServiceModel from '../models/ServiceModel';
import PropertyModel from '../models/PropertyModel';
import {SharedService} from '../services/SharedService';
import {PaginatedResult} from '../services/PaginatedResult';
import ENUMS from '../enums';


export const ServiceController = {

    addService: async function (ctx) {

        try {
            let newService = new ServiceModel(ctx.request.body);
            newService.createdAt = new Date();
            newService.lastModifiedAt = new Date();
            newService.active = true;

            ctx.response.body = await newService.save();
        } catch (e) {
            console.log(e)
            ctx.response.status = 400;
            ctx.response.body = e;
        }

    },
    
    getServices: async function (ctx) {

        let filter = { active: true }
        let paginatedResult = new PaginatedResult(ctx.query.pageNumber, ctx.query.pageSize);

        if(ctx.query.name) {
            filter = {serviceName: { $regex: '.*' + ctx.query.name + '.*' } }
        }

        try {
            const list = await ServiceModel.find(filter)
                .populate('sourceSystem', 'name')
                .skip((paginatedResult.pageNumber - 1) * paginatedResult.pageSize)
                .limit(paginatedResult.pageSize + 1);
            
            paginatedResult.setItems(list);
        } catch (e) {
            console.log(e)
            ctx.response.status = 400;
            ctx.response.body = e;
        }

        ctx.response.body = paginatedResult.getResult();
    },

    getServiceDetail: async function (ctx) {

        const filter = {
            _id: ctx.params.serviceId,
            active: true
        }

        try {
            const service = await ServiceModel.findOne(filter);

            if(service) {
                ctx.response.body = service
            } else {
                throw "Service not found";
            }

        } catch (e) {
            console.log(e)
            ctx.response.status = 400;
            ctx.response.body = e;
        }
    },

    updateService: async function (ctx) {
        const request = ctx.request.body;

        const filter = {
            _id: ctx.params.serviceId,
            active: true
        }

        try {
            let service = await ServiceModel.findOne(filter);

            if(service) {
                service.serviceName = request.serviceName;
                service.serviceType = request.serviceType;
                service.lastModifiedAt = new Date();
                service.properties = request.properties;
                ctx.response.body = await service.save();
            } else {
                throw "Service not found";
            }

        } catch (e) {
            console.log(e)
            ctx.response.status = 404;
            ctx.response.body = {message: e};
        }
    }, 

    deleteService: async function (ctx) {

        const filter = {
            _id: ctx.params.serviceId,
            active: true
        }

        try {
            let service = await ServiceModel.findOne(filter);

            if(service) {
                service.active = false;
                await service.save();
                ctx.response.status = 200;
            } else {
                throw "Service not found";
            }

        } catch (e) {
            console.log(e)
            ctx.response.status = 404;
            ctx.response.body = {message: e};
        }
    }, 

    // není jak vyuzit 
    getServiceProperties: async function (ctx) {
        const filter = {
            _id: ctx.params.serviceId,
            active: true
        }
    }, 

    addServiceProperty: async function (ctx) {
        const filter = {
            _id: ctx.params.serviceId,
            active: true
        }

        try {
            let service = await ServiceModel.findOne(filter);

            if(service) {
                let request = ctx.request.body
                let newProperty = new PropertyModel(request)
                newProperty.currentChange = ENUMS.PROPERTY_CHANGE_TYPES.NEW

                service.properties.push(newProperty)

                let updatedService = await service.save()
                ctx.response.status = 200;
                ctx.response.body = updatedService
            } else {
                throw "Service not found";
            }

        } catch (e) {
            console.log(e)
            ctx.response.status = 404;
            ctx.response.body = {message: e};
        }
    }, 

    // neni pouziti 
    getServicePropertyById: async function (ctx) {
        const filter = {
            _id: ctx.params.serviceId,
            active: true
        }
    },

    updateServiceProperty: async function (ctx) {
        const filter = {
            _id: ctx.params.serviceId,
            active: true
        }

        try {

            let service = await ServiceModel.findOne(filter)

            if(service) {

                let request = ctx.request.body
                let updatedProperty = service.properties.id(ctx.params.propertyId)

                if(updatedProperty) {
                    updatedProperty.propertyName = request.propertyName
                    updatedProperty.path = request.path
                    updatedProperty.propertyType = request.propertyType
                    updatedProperty.group = request.group
                    updatedProperty.mandatory = request.mandatory
                    updatedProperty.description = request.description
                } else {
                    throw "Property not found";
                }

                ctx.response.body = await service.save()

            } else {
                throw "Service not found";
            }
            

        } catch (e) {
            console.log(e)
            ctx.response.status = 404;
            ctx.response.body = {message: e};
        }
    },

    deleteServiceProperty: async function (ctx) {
        const filter = {
            _id: ctx.params.serviceId,
            active: true
        }

        try {

            let service = await ServiceModel.findOne(filter)

            if(service) {

                let removedProperty = service.properties.id(ctx.params.propertyId)

                if(removedProperty) {
                    removedProperty.currentChange = ENUMS.PROPERTY_CHANGE_TYPES.DELETE
                    service.lastModifiedAt = new Date()
                } else {
                    throw "Property not found";
                }

                ctx.response.body = await service.save()

            } else {
                throw "Service not found";
            }
            

        } catch (e) {
            console.log(e)
            ctx.response.status = 404;
            ctx.response.body = {message: e};
        }
    },

}