//web 服务启动入口文件
import path from 'path';
import paths from '../../scripts/paths';
import reactSsr from './middlewares/react-ssr';
import Koa from 'koa';
import koaStatic from 'koa-static';
import manifestHelper from './middlewares/manifest-helper';

const app = new Koa();
const manifestPath = path.join(paths.clientBuild);
// 设置可访问的静态资源，我们把 webpack 打包后的代码放到/dist/static目录下
app.use(koaStatic('./build/static'));

// 植入静态资源，res.locals
app.use(
  manifestHelper({
    manifestPath: `${manifestPath}/manifest.json`,
  }),
);

//react ssr 中间件
app.use(reactSsr);

//启动服务
app.listen(9001);

console.log('server is start http://localhost:9001');
