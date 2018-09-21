import ENUMS from '../enums'


export const wsdlHelper = (function () {
	return {
		getXsdTypeInfo: function (xsdObject) {
			const position = xsdObject._attributes.type.indexOf(':')
			return {
				type: xsdObject._attributes.type.substring(position+1, xsdObject._attributes.type.length),
				file: xsdObject._attributes.type.substring(0, position)
			}
		},

		findObjectByAttributeName: function (name, array) {
			return array.find(function(object) {
				return object._attributes.name === name
			})
		},

		getAllTypes: function(xsd) {
            
			let list = []

			if(xsd.schema.complexType) {
				for(var i = 0; i < xsd.schema.complexType.length; i++) {
					list.push(this.getXsdType(xsd.schema.complexType[i], ENUMS.XSD_TYPES.COMPLEX_TYPE))    
				}
			}

			if(xsd.schema.simpleType) {
				for(var i = 0; i < xsd.schema.simpleType.length; i++) {
					list.push(this.getXsdType(xsd.schema.simpleType[i], ENUMS.XSD_TYPES.SIMPLE_TYPE))    
				}
			}

			if(xsd.schema.group) {
				for(var i = 0; i < xsd.schema.group.length; i++) {
					list.push(this.getXsdType(xsd.schema.group[i], ENUMS.XSD_TYPES.GROUP))    
				}
			}

			if(xsd.schema.element) {
				for(var i = 0; i < xsd.schema.element.length; i++) {
					list.push(this.getXsdType(xsd.schema.element[i], ENUMS.XSD_TYPES.ELEMENT))    
				}
			}

			return list
		}, 

		getXsdType: function(content, type) {
			return {
				type: type,
				content: content
			}
		},

		getProperties: function(rootProp, allTypesList, propertyGroup) {

			rootProp._attributes.type = this.getPropertyType(rootProp._attributes.type)

			let propertyList = []
			propertyList = this.getPropertiesFromXsd(rootProp._attributes.type, propertyList, allTypesList, rootProp._attributes.name)

			for(let i = 0; i < propertyList.length; i++) {
				propertyList[i].group = propertyGroup

				if(propertyList[i].propertyType === 'array') {
   
					propertyList[i].propertyType = 'object'
					const index = propertyList[i].path.lastIndexOf('.') + 1
					const previousPropertyName = propertyList[i].path.substring(index, propertyList[i].path.length)

					let changedPropertyIndex = propertyList.findIndex((property) => {
						return property.propertyName === previousPropertyName
					})
					propertyList[changedPropertyIndex].propertyType = 'array'
				}
			}

			return propertyList
		},

		switchArrays: function(property, propertyList) {
			if(property.propertyType === 'array') {
				property.propertyType = 'object'
				const i = propertyList[i].path.lastIndexOf('.')
				const previousPropertyName = path.substring(i, propertyList[i].path.length)

				let changedPropertyIndex = propertyList.findIndex((property) => {
					return property.propertyName === previousPropertyName
				})
				console.log(changedPropertyIndex)
			}
		},
    
		getXsdTypeByName: function(currentPropertyType, allTypesList, preferedXsdGroup = null) {

			let currentXsdType
			if(!preferedXsdGroup) {
				currentXsdType = allTypesList.find(function(xsdType) {
					return xsdType.content._attributes.name === currentPropertyType
				})
			} else {
				currentXsdType = allTypesList.find(function(xsdType) {
					return (xsdType.content._attributes.name === currentPropertyType) && (xsdType.type === preferedXsdGroup)
				})
			}

			return currentXsdType
		},

		getPropertiesFromXsd: function(currentPropertyType, currentPropertyList, allTypesList, currentPath, propertyName = null, preferedXsdTypeName = null, annotation = null) {
			let currentXsdType
			if(!preferedXsdTypeName) {
				currentXsdType = this.getXsdTypeByName(currentPropertyType, allTypesList)
			} else {
				currentXsdType = this.getXsdTypeByName(currentPropertyType, allTypesList, preferedXsdTypeName)
			}

			console.log(currentPropertyType + ' ' + currentXsdType.type)

			switch(currentXsdType.type) {
			case ENUMS.XSD_TYPES.COMPLEX_TYPE: 

				if(currentXsdType.content.sequence) {
					currentPropertyList = this.parseSequence(currentXsdType.content.sequence, currentPath, currentPropertyList, allTypesList)
				}

				if(currentXsdType.content.choice) {
                        
					for(let i = 0; i < currentXsdType.content.choice.element; i++) {
						if(!ENUMS.BASIC_TYPES.includes(currentXsdType.content.choice.element[i]._attributes.type)) {
							const type = this.getPropertyType(currentXsdType.content.choice.element[i]._attributes.type)
							const name = currentXsdType.content.choice.element[i]._attributes.name
							const path = currentPath+'.'+name

							const objectType = this.getObjectType(currentXsdType.content.choice.element[i]._attributes.maxOccurs)
							const property = this.createProperty(name, currentPath, objectType)
							currentPropertyList.push(property)
							console.log('complexContent - choice')
							currentPropertyList = this.getPropertiesFromXsd(type, currentPropertyList, allTypesList, path)
						}
					}
               
				}

				if(currentXsdType.content.complexContent) {
					if (currentXsdType.content.complexContent.extension.sequence) {
						currentPropertyList = this.parseSequence(currentXsdType.content.complexContent.extension.sequence, currentPath, currentPropertyList, allTypesList)
					} else {
						const type = this.getPropertyType(currentXsdType.content.complexContent.extension._attributes.base)
						console.log('complexContent - else')
						currentPropertyList = this.getPropertiesFromXsd(type, currentPropertyList, allTypesList, currentPath)
					}
				}

				break
			case ENUMS.XSD_TYPES.ELEMENT:
				break
			case ENUMS.XSD_TYPES.GROUP:
				if(currentXsdType.content._attributes.name === 'Status') {
					return currentPropertyList
				}

				if(currentXsdType.content.sequence) {
					currentPropertyList = this.parseSequence(currentXsdType.content.sequence, currentPath, currentPropertyList, allTypesList)
				}

				break
			case ENUMS.XSD_TYPES.SIMPLE_TYPE: 
                    
				if(!annotation) {
					annotation = currentXsdType.content.annotation
				}

				if(ENUMS.BASIC_TYPES.includes(currentXsdType.content.restriction._attributes.base)) {
					const property = this.createProperty(propertyName, currentPath, currentXsdType.content.restriction._attributes.base, annotation)
					currentPropertyList.push(property)
				} else {
					console.log(666)
				}
				break
			}
			return currentPropertyList
		},

		getDescription: function (annotation) {
			let description = null
			if(annotation.documentation) {
				description = annotation.documentation._text
			}
			return description
		},

		getObjectType: function (maxOccurs) {
			if(maxOccurs === 'unbounded') {
				return ENUMS.COMPLEX_TYPES.ARRAY
			} else {
				return ENUMS.COMPLEX_TYPES.OBJECT
			}
		},

		getSequenceTypePath: function(sequenceElement) {
			if(sequenceElement._attributes.ref) {
				return xsdType._attributes.ref
			}

			if(sequenceElement._attributes.type) {
				return sequenceElement._attributes.type
			}
		},

		getPropertyType: function(propertyType) {
			const i = propertyType.indexOf(':') + 1
			return propertyType.substring(i,propertyType.length)
		}, 

		getSequenceTypes: function(currentXsdType, complexContent = false) {
			let list = []
			let sequencePath 

			if(complexContent) {
				sequencePath = currentXsdType.content.complexContent.extension.sequence
			} else {
				sequencePath = currentXsdType.content.sequence
			}

			let elementsList = []
			if(sequencePath.element) {
				elementsList = this.getXsdSequenceList(sequencePath.element)
			}

			let groupsList = []
			if(sequencePath.group) {
				groupsList = this.getXsdSequenceList(sequencePath.group)
			}

			list = elementsList.concat(groupsList)

			return list
		}, 

		getChoiceComplexTypes: function(currentXsdType) {
			let list = []
			for(xsdChoiceElement of currentXsdType.content.choice) {
				list.push(xsdChoiceElement)
			}

			return list
		},

		createProperty: function(name, path, type, annotation = null) {
			let description = null
			if(annotation) {
				description = this.getDescription(annotation)
			}

			return {
				propertyName: name,
				path: path,
				propertyType: type,
				description: description
			}
		}, 

		getXsdSequenceList: function(xsdSequence) {
			let list = []
			if(Array.isArray(xsdSequence)) {
				for(let i = 0; i < xsdSequence.length; i++) {
					list.push(xsdSequence[i])
				}
			} else {
				list.push(xsdSequence)
			}

			return list
		},

		getSequenceList: function(sequence) {
			let list = []
			let elementsList = []
			let groupsList = []
			if(sequence.element) {
				elementsList = this.getXsdSequenceList(sequence.element)
			}

			if(sequence.group) {
				groupsList = this.getXsdSequenceList(sequence.group)
			}

			list = elementsList.concat(groupsList)

			return list
		},

		parseSequence: function(sequence, currentPath, currentPropertyList, allTypesList) {
			let sequenceItems = this.getSequenceList(sequence)
			for(let i=0; i < sequenceItems.length;i++) {
				if(sequenceItems[i]._attributes.type) {
					currentPropertyList = this.parseSequenceElement(sequenceItems[i], currentPath, currentPropertyList, allTypesList)
					continue
				} 

				if(sequenceItems[i]._attributes.ref) {
					currentPropertyList = this.parseSequenceGroup(sequenceItems[i], currentPath, currentPropertyList, allTypesList)
					continue
				}
			}

			return currentPropertyList
		},

		parseSequenceElement: function(element, currentPath, currentPropertyList, allTypesList) {
			let path = currentPath

			if(!ENUMS.BASIC_TYPES.includes(element._attributes.type)) {
				const type = this.getPropertyType(element._attributes.type)
				const name = element._attributes.name

				const nextType = this.getXsdTypeByName(type, allTypesList)

				if(nextType.type === ENUMS.XSD_TYPES.SIMPLE_TYPE) { 
					console.log('parse sequence element - simple type')
					currentPropertyList = this.getPropertiesFromXsd(type, currentPropertyList, allTypesList, path, name, null, element.annotation)
				} else {
					const objectType = this.getObjectType(element._attributes.maxOccurs)
					const property = this.createProperty(name, path, objectType, element.annotation)
					currentPropertyList.push(property)

					path = currentPath + '.' + element._attributes.name
					console.log('parse sequence element - non simple type')
					currentPropertyList = this.getPropertiesFromXsd(type, currentPropertyList, allTypesList, path)
				}
			} else {
				const property = this.createProperty(element._attributes.name, path, element._attributes.type, element.annotation)
				currentPropertyList.push(property)
			}

			return currentPropertyList
		},
        
		parseSequenceGroup: function(group, currentPath, currentPropertyList, allTypesList) {
			const type = this.getPropertyType(group._attributes.ref)
			console.log('parse sequence group')
			currentPropertyList = this.getPropertiesFromXsd(type, currentPropertyList, allTypesList, currentPath, null, ENUMS.XSD_TYPES.GROUP)
			return currentPropertyList
		}
	}
})()