import ENUMS from '../enums'
import PropertyModel from '../models/PropertyModel';

export const PropertyImportHelper = function PropertyImportHelper(example, group) {

    const OBJECT = 'object'
    const ARRAY = 'array'
    const STRING = 'string'
    const INT = 'int'
    const BOOLEAN = 'boolean'

    this.group = group
    this.example = example

    const parseObject = function(object,group, path = '') {
        let properties = []
        for(let objectProperty in object) {
            let property = new PropertyModel()
            property.propertyType = getPropertyType(object[objectProperty])
            property.propertyName = objectProperty
            property.group = group
            property.mandatory = false
            property.path = path
            
            properties.push(property)

            if(property.propertyType === OBJECT) {
               let props = parseObject(object[objectProperty],group, createPath(path,objectProperty))
               properties = properties.concat(props)
            }

            if(property.propertyType === ARRAY) {
                const firstChildType = getPropertyType(object[objectProperty][0])

                if(firstChildType === OBJECT) {
                    let props = parseObject(object[objectProperty][0],group, createPath(path,objectProperty))
                    properties = properties.concat(props)
                }
             }
        }

        return properties
    }

    const createPath = function(currentPath,propertyName) {
        if(currentPath.length > 0) {
            return currentPath + '.' + propertyName
        } else {
            return propertyName
        }
    }

    const getPropertyType = function(propertyValue) {
        let type = null

        switch(typeof(propertyValue)) {
            case 'string':
                type = STRING
            break
            case 'boolean':
                type = BOOLEAN
            break
            case 'number':
                type = INT
            break
            case 'object':
                if(Array.isArray(propertyValue)) {
                    type = ARRAY
                } else {
                    type = OBJECT
                }
            break
        }

        return type
    }

    this.createProperties = function() {
        return parseObject(this.example, this.group)
    }

}


    /*
    const group = null

    function getProperties(jsonObject) {
        console.log(group)
 
        for (let propertyJson in propertiesJson.exampleObject) {

            let property = new PropertyModel()
            createImportedProperty(propertyJson, group)
            
            properties.push(property)

    }

    function createImportedProperty(propertyJson) {

        let property = new PropertyModel()

        property.propertyType = getPropertyType(propertyJson)
        property.propertyName = propertyJson
        property.path = (currentPath) ? currentPath : ''
        property.mandatory = false
        property.group = propertiesJson.group
        property.currentChange = ENUMS.PROPERTY_CHANGE_TYPES.NEW
    }

    function getPropertyType(propertyValue) {
        let type = null

        switch(typeof(propertyExampleValue)) {
            case 'string':
                type = 'string'
            break
            case 'boolean':
                type = 'boolean'
            break
            case 'number':
                type = 'int'
            break
            case 'object':
                if(Array.isArray(propertyExampleValue)) {
                    type = 'array'
                } else {
                    type = 'object'
                }
            break
        }

        return type
    }

    return {
        createProperties: function (jsonExample, group) {
            this.group = group

            getProperties(jsonExample)
        }
    }
    */
