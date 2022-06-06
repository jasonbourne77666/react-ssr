import webpack from 'webpack';
import serverConfig from './config/webpack.server.prod';
import clientConfig from './config/webpack.client.prod';
import { compilerPromise, logMessage } from './utils';

// 启动函数
const start = async () => {
  // 同时编译客户端和服务端
  // const multiCompiler = webpack([serverConfig, clientConfig]);
  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);

  // 优先完成client打包，生成 manifest.json 文件
  const clientPromise = compilerPromise('client', clientCompiler);
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

  try {
    await clientPromise;
  } catch (error) {
    logMessage(error, 'error');
  }

  // 再完成server打包。返回html需要使用到 client 生成的 manifest.json 文件
  const serverPromise = compilerPromise('server', serverCompiler);
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

  try {
    await serverPromise;
  } catch (error) {
    logMessage(error, 'error');
  }
};

start();
