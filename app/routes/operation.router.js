const Router = require("koa-router");
const router = new Router({prefix: '/api/operations'});

var Operation = require('../models/operation.model');

router
    .get('/', async function (ctx) {
        ctx.response.body = await Operation.find({});
    })

    .post('/', async function(ctx) {
        
        let operation = new Operation(ctx.request.body);
        ctx.response.body = operation;
        
        await operation.save(function (err) {
            if(err === null) {
                ctx.response.body = operation;
            } else {
                ctx.response.body = err.message;
            }
        });     

    })

    .get('/:operationId', async function (ctx) {
        if(ctx.params.operationId != null) {
            ctx.response.body = await Operation.findOne({_id: ctx.params.operationId});
        } 
    })

    .put('/:operationId', async function (ctx) {
        if(ctx.params.serviceId != null) {
            let service = {};
            ctx.response.body = ctx.request.body;
        } 
    })

    .delete('/:operationId', async function (ctx) {
        //ctx.status = 200;
    });

module.exports = router;