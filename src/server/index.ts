//web 服务启动入口文件
import path from 'path';
import Koa from 'koa';
import koaMount from 'koa-mount';
import koaStatic from 'koa-static';
import bodyParser from 'koa-bodyparser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import k2c from 'koa2-connect';
import paths from '../../scripts/paths';
import reactSsr from './middlewares/react-ssr';
import manifestHelper from './middlewares/manifest-helper';
import addStore from './middlewares/add-store';

const app = new Koa();
const manifestPath = path.join(paths.clientBuild, paths.publicPath);
// 设置可访问的静态资源，我们把 webpack 打包后的 client 代码放到/build/client目录下
app.use(koaMount(paths.publicPath, koaStatic('./build/client/static')));

// 植入静态资源，res.locals
app.use(
  manifestHelper({
    manifestPath: `${manifestPath}manifest.json`,
  }),
);

// redux
app.use(addStore);
// react ssr 中间件
app.use(reactSsr);

app.use(bodyParser());

app.use(async (ctx, next) => {
  if (ctx.url.startsWith('/api')) {
    ctx.respond = false; // 绕过koa内置对象response ，写入原始res对象，而不是koa处理过的response
    await k2c(
      createProxyMiddleware({
        target: 'http://gk28.top:8929',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          // '/api': '',
        },
      }),
    )(ctx, next);
  }

  await next();
});

// 启动服务
app.listen(9001);

console.log(`server is start http://localhost:${9001}`);
