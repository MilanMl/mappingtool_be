var TreeService = (function () {
    return {
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
      }
    }
  })();

  function setDependencyArray(node, array, hashMap) {

    if(!hashMap[node.serviceName]) {
        hashMap[node.serviceName] = true;
        var dependencyServiceObject = {
            serviceName: node.serviceName,
            sourceSystem: node.sourceSystem,
            type: node.type
        }
        array.push(dependencyServiceObject);
    }
}
  
  module.exports = TreeService;