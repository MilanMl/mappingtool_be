
var SharedServices = (function () {
    return {
        getNewServiceParams: function (request,user) {

            let service = {};

            service.properties = (request.properties !== undefined) ? request.properties : [];
            service.serviceType = request.serviceType;
            service.sourceSystem = request.sourceSystem;
            service.serviceName = request.serviceName;
            service.description = request.description;
            service.version = request.version;
            service.createdAt = new Date();
            service.createdBy = user;
            service.lastModifiedAt = new Date();
            service.lastModifiedBy = user;
            service.userDefined = true;
            service.active = true;

            return service;
        },

        modifyServiceParams: function(service, request, user) {

            service.lastModifiedAt = new Date();
            service.lastModifiedBy = user;
            service.serviceType = request.serviceType;
            service.sourceSystem = request.sourceSystem;
            service.serviceName = request.serviceName;
            service.description = request.description;
            service.properties = request.properties;

            return service;
        }
    }
  })();

  module.exports = SharedServices;