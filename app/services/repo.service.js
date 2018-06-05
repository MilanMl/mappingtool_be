var Service = require('../models/service.model');
var ServiceDependency = require('../models/serviceDependency.model');

var RepoService = (function () {
    return {
        addNewService: async function (_service) {
            var service = new Service();
            const properties = (_service.properties !== undefined) ? _service.properties : [];
            service.serviceName = _service.serviceName;
            service.sourceSystem = _service.sourceSystem;
            service.serviceType = _service.serviceType;
            service.description = _service.description;
            service.lastUpdatedAt = new Date();
            service.lastUpdatedBy = "user XY";
            service.properties = properties;

            return await service.save();
        },
        addDependecyServices: async function (_dependencyServices) {
            for(var i = 0; i < _dependencyServices.length; i++) {
                _dependencyServices[i].properties = [];
                var addedService = await this.addNewService(_dependencyServices[i]);
                _dependencyServices[i]._id = addedService;
            }
            return _dependencyServices;
        },
        updateDependencies: async function (_serviceId, _dependencies) {
            await ServiceDependency.findOne({service: _serviceId},(error, serviceDependency) => {
                if (error) {
                    return false;
                } else {
                    serviceDependency.dependencies = _dependencies;
                    serviceDependency.save();
                }
            });
        }
    }

  })();

  module.exports = RepoService;