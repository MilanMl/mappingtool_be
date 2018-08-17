import  Router from 'koa-router'
import { WsdlImportController } from '../controllers/WsdlImportController'

const router = new Router({prefix: '/api/wsdl-imports'})

router
	.get('/', WsdlImportController.getWsdlImports)
	.post('/', WsdlImportController.addWsdlImport)
	.get('/:wsdlId', WsdlImportController.getWsdlImportById)
	.put('/:wsdlId', WsdlImportController.updateWdlImport)
	.get('/:wsdlId/operations/:operationId/transformed', WsdlImportController.getTransformedWsdlOperation)
    
export default router