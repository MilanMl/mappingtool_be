import ServiceModel from '../models/ServiceModel';

export const ServiceDefinition = (function () {
    return {
        createNewService: async function(service) {
            let newService = new ServiceModel(service);

            newService.createdAt = new Date();
            newService.lastModifiedAt = new Date();
            newService.active = true;

            const savedModel = await newService.save();

            return savedModel;
        },

        getServices: async function() {
            return await ServiceModel.find();
        }
    }
})()
