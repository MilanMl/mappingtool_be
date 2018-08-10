import Koa from 'koa';
import logger from 'koa-logger';
import BodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import serve from 'koa-static';
import mount from 'koa-mount';
import application from './app/config/application';
import router from './app/routes/index';
import ENV_CONFIG from './app/config/envConfig';
import mongoose from 'mongoose';

const dbRoute = application.getDbConnectionRoute();
console.log(dbRoute)
mongoose.connect(dbRoute, { useMongoClient: true });
mongoose.connection
  .on('connected', function() {
    console.log('Mongoose default connection open');
  })
  .on('error', function(err) {
    console.log('Mongoose default connection error: ' + err);
  })
  .on('disconnected', function() {
    console.log('Mongoose default connection disconnected');
  });

const app = new Koa();

app
  .use(cors({ origin: ENV_CONFIG.LOCAL.ALLOWED_CORS.URL }))
  .use(BodyParser())
  .use(router)
  .on('error', (err, ctx) => {
    ctx.body = {message: err.message}
  })
  .use(
    mount(
      '/static_folder',
      serve(__dirname + '/static_folder', {
        defer: true,
        setHeaders(res) {
          res.setHeader('content-type', 'application/wsdl+xml');
        }
      })
    )
  )

app.listen(ENV_CONFIG.LOCAL.PORT);
