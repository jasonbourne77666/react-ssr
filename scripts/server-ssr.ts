// 基于 webpack  开启对服务端代码的编译和监听，服务端代码改变，触发重新编译
// 配置文件为 webpack.server.dev.ts
import fs from 'fs';
import webpack from 'webpack';
import nodemon from 'nodemon';
// import koa from 'koa';
import serverConfig from './config/webpack.server.dev';
import clientConfig from './config/webpack.client.dev';
import * as constant from './constant';
import paths from './paths';
import { compilerPromise, logMessage } from './utils';

// 创建webpack服务
// const app = koa();

const start = async () => {
  // 同时编译客户端和服务端
  const multiCompiler = webpack([serverConfig, clientConfig]);

  const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client');
  const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server');

  const clientPromise = compilerPromise('client', clientCompiler);

  const serverPromise = compilerPromise('server', serverCompiler);

  clientCompiler!.watch(
    {
      aggregateTimeout: 300, // 类似节流功能,聚合多个更改一起构建
      ignored: /node_modules/, //排除文件
      poll: 2000, //轮训的方式检查变更 单位：秒  ,如果监听没生效，可以试试这个选项.
    },
    (error, stats) => {
      if (!error && stats && !stats.hasErrors()) {
        console.log(stats.toString(serverConfig.stats));
        return;
      }

      if (error) {
        logMessage(error, 'error');
      }

      if (stats!.hasErrors()) {
        const info: any = stats!.toJson();
        console.log('clientCompiler', info.errors[0]);
        // const errors = (info!.errors[0] as any).split('\n');
        // logMessage(errors[0], 'error');
        // logMessage(errors[1], 'error');
        // logMessage(errors[2], 'error');
      }
    },
  );

  // 创建监听对象, 监听服务端改变
  serverCompiler!.watch(
    {
      aggregateTimeout: 300, // 类似节流功能,聚合多个更改一起构建
      ignored: /node_modules/, //排除文件
      poll: 2000, //轮训的方式检查变更 单位：秒  ,如果监听没生效，可以试试这个选项.
    },
    (error, stats) => {
      if (!error && stats && !stats.hasErrors()) {
        console.log(stats.toString(serverConfig.stats));
        return;
      }

      if (error) {
        logMessage(error, 'error');
      }

      if (stats!.hasErrors()) {
        const info: any = stats!.toJson();
        console.log('serverCompiler', info.errors[0]);
        // const errors = (info!.errors[0] as any).split('\n');
        // logMessage(errors[0], 'error');
        // logMessage(errors[1], 'error');
        // logMessage(errors[2], 'error');
      }
    },
  );

  // wait until client and server is compiled
  try {
    await serverPromise;
    await clientPromise;
  } catch (error) {
    logMessage(error, 'error');
  }

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
