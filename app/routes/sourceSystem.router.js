const Router = require("koa-router");
const router = new Router({prefix: '/api/systems'});

var SourceSystem = require('../models/sourceSystem.model');

router
    .get('/', async function (ctx) {
       ctx.response.body = await SourceSystem.find();
    })

    .post('/', async function(ctx) {
        let sourceSystem = new SourceSystem(ctx.request.body);
        sourceSystem = await sourceSystem.save();
        ctx.response.body = sourceSystem;

    })

    .get('/:sourceSystemId', async function (ctx) {
        if(ctx.params.serviceId != null) {
            ctx.response.body = [];
        } 
    })

    .put('/:sourceSystemId', async function (ctx) {
        if(ctx.params.serviceId != null) {
            let service = {};
            ctx.response.body = ctx.request.body;
        } 
    })

    .delete('/:sourceSystemId', async function (ctx) {
        ctx.status = 200;
    });

module.exports = router;