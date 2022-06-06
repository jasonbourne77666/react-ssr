import webpack, { Stats } from 'webpack';
import nodemon from 'nodemon';
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

// 启动函数
const start = async () => {
  // 同时编译客户端和服务端
  // const multiCompiler = webpack([serverConfig, clientConfig]);
  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);

  const clientPromise = compilerPromise('client', clientCompiler);
  // 优先完成client打包，生成 manifest.json 文件
  clientCompiler!.watch(watchOptions, watchCallback);
  try {
    await clientPromise;
  } catch (error) {
    logMessage(error, 'error');
  }

  // 再完成server打包。返回html需要使用到 client 生成的 manifest.json 文件
  const serverPromise = compilerPromise('server', serverCompiler);
  // 创建监听对象, 监听服务端改变
  serverCompiler!.watch(watchOptions, watchCallback);
  try {
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
