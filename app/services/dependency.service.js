var Service = require('../models/service.model');
var RepoService = require('./repo.service');

var DependencyService = (function () {
    return {
        getNewDependencyServices: async function (_services, _existingServices) {
            let newDependencyServices = [];
            for(var i = 0; i < _services.length; i++) {
                const exService = _existingServices.find(function(eS) {
                    return eS.serviceName === _services[i].serviceName;
                });

                if(exService === undefined) {
                    newDependencyServices.push(_services[i]);
                }
            }

            return newDependencyServices;
        },
        getExistingServices: async function(_services) {
            const dependencyServicesNames = _services.map(ds => ds.serviceName);
            return Service
                .find({'serviceName': {$in: dependencyServicesNames}})
                .select('serviceName sourceSystem serviceType');
        },
        getPropertyDependencies: function (serviceProperties) {
            var stack = [], array = []; hashMap = {};
          
            for(var i = 0; i < serviceProperties.length; i++) {
                for(var j = 0; j < serviceProperties[i].dependencies.length; j++) {
                   stack.push(serviceProperties[i].dependencies[j]);
                }
            }
            
            while(stack.length !== 0) {
                var node = stack.pop();
    
                if(node.property.dependencies.length !== 0) {
                    for(var i = 0; i < node.property.dependencies.length; i++) {
                        stack.push(node.property.dependencies[i])
                    }
                    setDependencyArray(node,array, hashMap);
                } else {
                    setDependencyArray(node,array, hashMap);
                }
            }

            return array;
        },
        setDependencyServices: async function(_service) {
            const allServiceDependecies = this.getPropertyDependencies(_service.properties);
            const existingServices = await DependencyService.getExistingServices(allServiceDependecies);
            let newDependencyServices = await DependencyService.getNewDependencyServices(allServiceDependecies, existingServices);
            newDependencyServices = await RepoService.addDependecyServices(newDependencyServices);

            return existingServices.concat(newDependencyServices);
        }
    }

  })();

  function setDependencyArray(node, array, hashMap) {
    if(!hashMap[node.serviceName]) {
        hashMap[node.serviceName] = true;
        var dependencyServiceObject = {
            serviceName: node.serviceName,
            serviceType: node.serviceType,
            sourceSystem: node.sourceSystem
        }
        array.push(dependencyServiceObject);
    }
  }

  module.exports = DependencyService;