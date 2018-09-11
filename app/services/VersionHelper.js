import VersionModel  from '../models/VersionModel'

export const VersionHelper = (function() {

	return {

		addVersion: async function(version) {
			let newVersion = new VersionModel(version)

			return await newVersion.save()
		},

		getVersionsList: async function(name = null, future = false) {

			let filter = {}

			if(name) {
				filter.name = name
			}

			return await VersionModel.find(filter)
		},

		getVersionById: async function (versionId) {
			const filter = {
				_id: versionId
			}

			return await VersionModel.findOne(filter)
		}, 

		updateVersion: async function(versionId, version) {
			const filter = {
				_id: versionId
			}

			return await VersionModel.findOne(filter)
		}, 

		deleteVersion: async function(versionId) {
			const filter = {
				_id: versionId
			}

			return await VersionModel.findOne(filter)
		}
	}
})()