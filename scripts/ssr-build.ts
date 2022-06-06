import fs from 'fs';
import webpack from 'webpack';
import nodemon from 'nodemon';
// import koa from 'koa';
import serverConfig from './config/webpack.server.prod';
import clientConfig from './config/webpack.client.prod';
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

  clientCompiler!.run((error, stats) => {
    if (error) {
      console.error(error);
      return;
    }
    if (stats) {
      console.log(
        stats.toString({
          chunks: false, // 使构建过程更静默无输出
          colors: true, // 在控制台展示颜色
        }),
      );
    }

    clientCompiler!.close((closeErr) => {
      console.log(closeErr);
    });
  });

  // 创建监听对象, 监听服务端改变
  serverCompiler!.run((error, stats) => {
    if (error) {
      console.error(error);
      return;
    }

    if (stats) {
      console.log(
        stats.toString({
          chunks: false, // 使构建过程更静默无输出
          colors: true, // 在控制台展示颜色
        }),
      );
    }

    serverCompiler!.close((closeErr) => {
      console.log(closeErr);
    });
  });

  // wait until client and server is compiled
  try {
    await serverPromise;
    await clientPromise;
  } catch (error) {
    logMessage(error, 'error');
  }
};

start();
