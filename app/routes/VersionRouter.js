import Router from 'koa-router'
import { VersionController } from '../controllers/VersionController'

const router = new Router({prefix: '/api/versions'})

router
	.get('/', VersionController.getVersions)
	.post('/', VersionController.addVersion)
	.get('/:versionId', VersionController.getVersionDetail)
	.put('/:versionId', VersionController.updateVersion)
	.delete('/:versionId', VersionController.deleteVersion)

export default router