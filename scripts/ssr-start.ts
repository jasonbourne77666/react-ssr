import webpack, { Stats, Compiler } from 'webpack';
import nodemon from 'nodemon';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import serverConfig from './config/webpack.server.dev';
import clientConfig from './config/webpack.client.dev';
import paths from './paths';
import { compilerPromise, logMessage } from './utils';

// watch 回调，打印构建信息或报错
const watchCallback = (error?: null | Error, stats?: Stats) => {
  if (!error && stats && !stats.hasErrors()) {
    console.log(stats.toString(serverConfig.stats));
    return;
  }

  if (error) {
    logMessage(error, 'error');
  }

  if (stats && stats.hasErrors()) {
    const info = stats.toString();
    logMessage(info, 'error');
  }
};

// watch 参数
const watchOptions = {
  aggregateTimeout: 300, // 类似节流功能,聚合多个更改一起构建
  ignored: /node_modules/, //排除文件
  poll: 2000, //轮训的方式检查变更 单位：秒  ,如果监听没生效，可以试试这个选项.
};

const app = express();
// 热更新服务
const WEBPACK_PORT =
  process.env.WEBPACK_PORT || (!isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) + 1 : 9002);

const DEVSERVER_HOST = process.env.DEVSERVER_HOST || 'http://localhost';

const publicPath = clientConfig.output!.publicPath;
// webpack-hot-middleware/client
(clientConfig.entry as any).client = [
  `webpack-hot-middleware/client?path=${DEVSERVER_HOST}:${WEBPACK_PORT}/__webpack_hmr`,
  ...(clientConfig.entry as any).client,
];

clientConfig.output!.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
clientConfig.output!.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js';

clientConfig.output!.publicPath = [`${DEVSERVER_HOST}:${WEBPACK_PORT}`, publicPath]
  .join('/')
  .replace(/([^:+])\/+/g, '$1/');

serverConfig.output!.publicPath = [`${DEVSERVER_HOST}:${WEBPACK_PORT}`, publicPath]
  .join('/')
  .replace(/([^:+])\/+/g, '$1/');

// 启动函数
const start = async () => {
  console.log('clientConfig publicPath', clientConfig.output!.publicPath);
  console.log('serverConfig publicPath', serverConfig.output!.publicPath);
  // 同时编译客户端和服务端
  const multiCompiler = webpack([serverConfig, clientConfig]);

  const clientCompiler: Compiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client')!;
  const serverCompiler: Compiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server')!;

  const clientPromise = compilerPromise('client', clientCompiler);
  const serverPromise = compilerPromise('server', serverCompiler);

  // 创建监听对象, 监听服务端改变
  // clientCompiler!.watch(watchOptions, watchCallback);
  serverCompiler!.watch(watchOptions, watchCallback);

  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    return next();
  });

  // // 启动热更新服务器
  app.use(
    webpackDevMiddleware(clientCompiler, {
      publicPath: clientConfig.output!.publicPath,
      writeToDisk: true, // 生成文件
    }),
  );

  app.use(webpackHotMiddleware(clientCompiler));

  app.use('/static', express.static(paths.clientBuild));

  app.listen(WEBPACK_PORT, () => {
    console.log(`HMR server ${DEVSERVER_HOST}:${WEBPACK_PORT}`);
  });

  try {
    await clientPromise;
    await serverPromise;
  } catch (error) {
    logMessage(error, 'error');
  }

  // 启动nodemon，监听server.js是否变化。重启server
  const script = nodemon({
    script: `${paths.serverBuild}/server.js`,
    // 只监听服务端的文件
    ignore: ['src', 'scripts', 'config', './*.*', 'build/client', '**/locales', '**/tmp'],
    delay: 200,
  });

  script.on('readable', function () {
    // the `readable` event indicates that data is ready to pick up
    logMessage('Server side app has been readable.', 'warning');
  });

  script.on('restart', () => {
    logMessage('Server side app has been restarted.', 'warning');
  });

  script.on('quit', () => {
    console.log('Process ended');
    process.exit();
  });

  script.on('error', () => {
    logMessage('An error occured. Exiting', 'error');
    process.exit(1);
  });
};

start();
