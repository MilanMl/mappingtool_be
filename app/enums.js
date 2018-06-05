const enums = {
    PROPERTY_TYPES: ['date','dateTime','time','string','decimal','long','boolean','int','positiveInteger','object','array'],
    COMPLEX_TYPES: {
        OBJECT: 'object',
        ARRAY: 'array'
    },
    XSD_TYPES: {
        ELEMENT: 'element',
        SIMPLE_TYPE: 'simpleType',
        COMPLEX_TYPE: 'complexType',
        GROUP: 'group'
    },
    PROPERTY_GROUPS: {
        REQUEST: 'request',
        RESPONSE: 'response',
        HEADER: 'header',
        ROUTE: 'route'
    },
    //PROPERTY_TYPES: ['date','dateTime','time','string','decimal','long','boolean','int','positiveInteger','object','array'],
    SERVICE_TYPES: {
        REST: 'REST',
        SOAP: 'SOAP'
    },
    PROPERTY_CHANGE_TYPES: {
        NEW: 'NEW',
        UPDATE: 'UPDATE',
        DELETE: 'DELETE'
    }
}

export default enums;