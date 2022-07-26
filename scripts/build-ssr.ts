import webpack, { Compiler } from 'webpack';
import serverConfig from './config/webpack.server.prod';
import clientConfig from './config/webpack.client.prod';
import { compilerPromise, logMessage } from './utils';

// 启动函数
const start = async () => {
  // 同时编译客户端和服务端
  const multiCompiler = webpack([serverConfig, clientConfig]);
  const clientCompiler: Compiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client')!;
  const serverCompiler: Compiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server')!;

  // 通过webpack钩子函数，监听编译进度
  const serverPromise = compilerPromise('server', serverCompiler);
  const clientPromise = compilerPromise('client', clientCompiler);

  // 执行编译
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
      closeErr && console.log(closeErr);
    });
  });

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
      closeErr && console.log(closeErr);
    });
  });

  try {
    await serverPromise;
    await clientPromise;
  } catch (error) {
    logMessage(error, 'error');
  }
};

start();
