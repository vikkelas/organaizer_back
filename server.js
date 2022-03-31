const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const Router = require('koa-router');
const multer = require('koa-multer');
const koaStatic = require('koa-static');
const upload = require('./API/upload');
const router = new Router();
const app = new Koa();
app.use(cors());
const port = process.env.PORT || 8080;

app.use(koaBody({
   urlencoded: true,
   multipart: true,
   json: true,
}));

router.post('/upload', (ctx) => {
   upload.uploadFile(ctx);
   ctx.request.files.file[0].id

});



app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback()).listen(port);