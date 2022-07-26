//web 服务启动入口文件
import path from 'path';
import paths from '../../scripts/paths';
import reactSsr from './middlewares/react-ssr';
import Koa from 'koa';
import koaMount from 'koa-mount';
import koaStatic from 'koa-static';
import manifestHelper from './middlewares/manifest-helper';

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

//react ssr 中间件
app.use(reactSsr);

//启动服务
app.listen(process.env.PORT || 9001);

console.log(`server is start http://localhost:${process.env.PORT || 9001}`);
