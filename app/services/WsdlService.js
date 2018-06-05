import ENUMS from '../enums';
import { StaticFilesService } from './StaticFilesService';

export const WsdlService = (function() {
  let createProperty = function(name, path, type, annotation = null) {
    let description = null;
    if (annotation) {
      description = getDescription(annotation);
    }

    return {
      propertyName: name,
      path: path,
      propertyType: type,
      description: description
    };
  };

  let createXsdType = function(content, type) {
    return {
      type: type,
      content: content
    };
  };

  let getDescription = function(annotation) {
    let description = null;
    if (annotation.documentation) {
      description = annotation.documentation._text;
    }
    return description;
  };

  let getPropertyType = function(propertyType) {
    const i = propertyType.indexOf(':') + 1;
    return propertyType.substring(i, propertyType.length);
  };

  let getPropertiesFromXsd = function(
    currentPropertyType,
    currentPropertyList,
    allTypesList,
    currentPath,
    propertyName = null,
    preferedXsdTypeName = null,
    annotation = null
  ) {
    let currentXsdType;
    if (!preferedXsdTypeName) {
      currentXsdType = getXsdTypeByName(currentPropertyType, allTypesList);
    } else {
      currentXsdType = getXsdTypeByName(currentPropertyType,allTypesList,preferedXsdTypeName);
    }

    console.log('parse type: ' + currentPropertyType + ' ' + '(' + currentXsdType.type +')');

    switch (currentXsdType.type) {
      case ENUMS.XSD_TYPES.COMPLEX_TYPE:
        if (currentXsdType.content.sequence) {
          currentPropertyList = parseSequence(currentXsdType.content.sequence,currentPath,currentPropertyList,allTypesList);
        }

        if (currentXsdType.content.choice) {
          for (let i = 0; i < currentXsdType.content.choice.element.length; i++) {
            if (
              !ENUMS.PROPERTY_TYPES.includes(
                currentXsdType.content.choice.element[i]._attributes.type
              )
            ) {
              const type = getPropertyType(currentXsdType.content.choice.element[i]._attributes.type);
              const name = currentXsdType.content.choice.element[i]._attributes.name;
              const path = currentPath + '.' + name;

              const objectType = getObjectType(currentXsdType.content.choice.element[i]._attributes.maxOccurs);
              const property = createProperty(name, currentPath, objectType);
              currentPropertyList.push(property);
              console.log('complexContent - choice');
              currentPropertyList = getPropertiesFromXsd(type,currentPropertyList,allTypesList,path);
            }
          }
        }

        if (currentXsdType.content.complexContent) {
          if (currentXsdType.content.complexContent.extension.sequence) {
            console.log('currentXsdType.content.complexContent.extension.sequence')
            currentPropertyList = parseSequence(currentXsdType.content.complexContent.extension.sequence,currentPath,currentPropertyList,allTypesList)
          } else {
            const type = getPropertyType(currentXsdType.content.complexContent.extension._attributes.base)
            console.log('complexContent - else');
            currentPropertyList = getPropertiesFromXsd(type,currentPropertyList,allTypesList,currentPath)
          }

          /*

                    OBECNY FAIL - Muze existovat typ, ktery ma v sobe jine typy se stejnym nazvem (pokud je pak ten typ v allTypesList na prvnim miste, pak se to zacykli :/ )

                    if(currentXsdType.content.complexContent.extension._attributes.base) {
                        const type = getPropertyType(currentXsdType.content.complexContent.extension._attributes.base);
                        console.log('complexContent - else')
                        currentPropertyList = getPropertiesFromXsd(type, currentPropertyList, allTypesList, currentPath);
                    }
                    */
        }

        break;
      case ENUMS.XSD_TYPES.ELEMENT:
        break;
      case ENUMS.XSD_TYPES.GROUP:
        if (currentXsdType.content._attributes.name === 'Status') {
          return currentPropertyList;
        }

        if (currentXsdType.content.sequence) {
          currentPropertyList = parseSequence(currentXsdType.content.sequence,currentPath,currentPropertyList,allTypesList);
        }

        break;
      case ENUMS.XSD_TYPES.SIMPLE_TYPE:
        if (!annotation) {
          annotation = currentXsdType.content.annotation;
        }

        if (
          ENUMS.PROPERTY_TYPES.includes(
            currentXsdType.content.restriction._attributes.base
          )
        ) {
          const property = createProperty(propertyName,currentPath,currentXsdType.content.restriction._attributes.base,annotation);
          currentPropertyList.push(property);
        } else {
          console.log(666);
        }
        break;
    }
    return currentPropertyList;
  };

  let getXsdTypeByName = function(
    currentPropertyType,
    allTypesList,
    preferedXsdGroup = null
  ) {
    let currentXsdType;
    if (!preferedXsdGroup) {
      currentXsdType = allTypesList.find(function(xsdType) {
        return xsdType.content._attributes.name === currentPropertyType;
      });
    } else {
      currentXsdType = allTypesList.find(function(xsdType) {
        return (
          xsdType.content._attributes.name === currentPropertyType &&
          xsdType.type === preferedXsdGroup
        );
      });
    }

    return currentXsdType;
  };

  let parseSequence = function(
    sequence,
    currentPath,
    currentPropertyList,
    allTypesList
  ) {
    let sequenceItems = getSequenceList(sequence);
    for (let i = 0; i < sequenceItems.length; i++) {
      if (sequenceItems[i]._attributes.type) {
        currentPropertyList = parseSequenceElement(sequenceItems[i],currentPath,currentPropertyList,allTypesList);
        continue;
      }

      if (sequenceItems[i]._attributes.ref) {
        currentPropertyList = parseSequenceGroup(sequenceItems[i],currentPath,currentPropertyList,allTypesList);
        continue;
      }
    }

    return currentPropertyList;
  };

  let parseSequenceElement = function(
    element,
    currentPath,
    currentPropertyList,
    allTypesList
  ) {
    let path = currentPath;

    if (!ENUMS.PROPERTY_TYPES.includes(element._attributes.type)) {
      const type = getPropertyType(element._attributes.type);
      const name = element._attributes.name;

      const nextType = getXsdTypeByName(type, allTypesList);

      if (nextType.type === ENUMS.XSD_TYPES.SIMPLE_TYPE) {
        console.log('parse sequence element - simple type');
        currentPropertyList = getPropertiesFromXsd(type,currentPropertyList,allTypesList,path,name,null,element.annotation);
      } else {
        const objectType = getObjectType(element._attributes.maxOccurs);
        const property = createProperty(name,path,objectType,element.annotation);
        currentPropertyList.push(property);

        path = currentPath + '.' + element._attributes.name;
        console.log('parse sequence element - non simple type');
        currentPropertyList = getPropertiesFromXsd(type,currentPropertyList,allTypesList,path);
      }
    } else {
      const property = createProperty(element._attributes.name,path,element._attributes.type,element.annotation);
      currentPropertyList.push(property);
    }

    return currentPropertyList;
  };

  let parseSequenceGroup = function(group,currentPath,currentPropertyList,allTypesList) {
    const type = getPropertyType(group._attributes.ref);
    console.log('parse sequence group');
    currentPropertyList = getPropertiesFromXsd(type,currentPropertyList,allTypesList,currentPath,null,ENUMS.XSD_TYPES.GROUP);
    return currentPropertyList;
  };

  let getObjectType = function(maxOccurs) {
    if (maxOccurs === 'unbounded') {
      return ENUMS.COMPLEX_TYPES.ARRAY;
    } else {
      return ENUMS.COMPLEX_TYPES.OBJECT;
    }
  };

  let getSequenceList = function(sequence) {
    let list = [];
    let elementsList = [];
    let groupsList = [];
    if (sequence.element) {
      elementsList = getXsdSequenceList(sequence.element);
    }

    if (sequence.group) {
      groupsList = getXsdSequenceList(sequence.group);
    }

    list = elementsList.concat(groupsList);

    return list;
  };

  let getXsdSequenceList = function(xsdSequence) {
    let list = [];
    if (Array.isArray(xsdSequence)) {
      for (let i = 0; i < xsdSequence.length; i++) {
        list.push(xsdSequence[i]);
      }
    } else {
      list.push(xsdSequence);
    }

    return list;
  };

  return {
    findObjectByAttributeName: function(name, array) {
      return array.find(function(object) {
        return object._attributes.name === name;
      });
    },

    getAllWsdlTypes: async function(
      xsd,
      currentTypeList,
      rootPath,
      schemaLocations = []
    ) {
      if (xsd.schema.import) {
        for (let i = 0; i < xsd.schema.import.length; i++) {
          if (
            schemaLocations.includes(
              xsd.schema.import[i]._attributes.schemaLocation
            )
          ) {
            continue;
          }

          const path = xsd.schema.import[i]._attributes.schemaLocation.replace(
            '../',
            ''
          );
          schemaLocations.push(xsd.schema.import[i]._attributes.schemaLocation);

          const loadedXsd = await StaticFilesService.getStaticFile(rootPath + path);
          const loadXsdJson = StaticFilesService.convertXmlFileToJson(loadedXsd);
          const importedTypeList = this.getTypesFromXsd(loadXsdJson);
          currentTypeList = currentTypeList.concat(importedTypeList);

          currentTypeList = await this.getAllWsdlTypes(loadXsdJson,currentTypeList,rootPath,schemaLocations);
        }
      }

      return currentTypeList;
    },

    getTypesFromXsd: function(xsd) {
      let list = [];

      if (xsd.schema.complexType) {
        for (var i = 0; i < xsd.schema.complexType.length; i++) {
          list.push(
            createXsdType(xsd.schema.complexType[i],ENUMS.XSD_TYPES.COMPLEX_TYPE)
          )
        }
      }

      if (xsd.schema.simpleType) {
        for (var i = 0; i < xsd.schema.simpleType.length; i++) {
          list.push(
            createXsdType(xsd.schema.simpleType[i], ENUMS.XSD_TYPES.SIMPLE_TYPE)
          );
        }
      }

      if (xsd.schema.group) {
        for (var i = 0; i < xsd.schema.group.length; i++) {
          list.push(createXsdType(xsd.schema.group[i], ENUMS.XSD_TYPES.GROUP));
        }
      }

      if (xsd.schema.element) {
        for (var i = 0; i < xsd.schema.element.length; i++) {
          list.push(
            createXsdType(xsd.schema.element[i], ENUMS.XSD_TYPES.ELEMENT)
          );
        }
      }

      return list;
    },

    getTransformedPropertiesByGroup: function(rootProp,allTypesList,propertyGroup) {
      rootProp._attributes.type = getPropertyType(rootProp._attributes.type);
      let propertyList = [];
      propertyList = getPropertiesFromXsd(rootProp._attributes.type,propertyList,allTypesList,rootProp._attributes.name);

      for (let i = 0; i < propertyList.length; i++) {
        propertyList[i].group = propertyGroup;

        if (propertyList[i].propertyType === ENUMS.COMPLEX_TYPES.ARRAY) {
          propertyList[i].propertyType = ENUMS.COMPLEX_TYPES.OBJECT;
          const index = propertyList[i].path.lastIndexOf('.') + 1;
          const previousPropertyName = propertyList[i].path.substring(index,propertyList[i].path.length);

          let changedPropertyIndex = propertyList.findIndex((property, index) => {
              return property.propertyName === previousPropertyName;
            }
          );
          propertyList[changedPropertyIndex].propertyType = ENUMS.COMPLEX_TYPES.ARRAY;
        }
      }

      /*
            propertyList.sort((a, b) => {
                if (a.path > b.path) {
                    return 1;
                  }
                if (a.path < b.path) {
                    return -1;
                }
                  return 0;
            });
            */

      return propertyList;
    },

    getWsdlOperations: async function(wsdlName) {
      const wsdlPath = this.createWsdlFilePath(wsdlName);
      console.log(wsdlPath);
      let wsdl = await StaticFilesService.getStaticFile(wsdlPath);

      const wsdlJson = StaticFilesService.convertXmlFileToJson(wsdl);

      let operations = [];
      for (let i = 0; i < wsdlJson.definitions.portType.operation.length; i++) {
        operations.push({
          operationName: wsdlJson.definitions.portType.operation[i]._attributes.name
        });
      }

      return operations;
    },

    createWsdlFilePath: function(wsdlName) {
      return (
        '/static_folder/services/' + wsdlName + '/structured/' + wsdlName + '.wsdl'
      );
    }
  };
})();
