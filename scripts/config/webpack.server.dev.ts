// 配置文件 用webpack打包服务端代码， /src/server

import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
// 页面显示错误信息
// import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import { merge } from 'webpack-merge';
import common from './webpack.base';
import paths from '../paths';

export default merge<Configuration>(common, {
  name: 'server',
  target: 'node',
  entry: {
    server: paths.serverIndex,
  },
  // 排除不需要打包的模块，因为 node 端会自动载入这些包，可以让打包的文件更小。
  externals: [nodeExternals()],
  output: {
    filename: '[name].js',
    path: paths.serverBuild,
    publicPath: '/',
    // clean: true,
  },
  stats: {
    assets: false,
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: false,
    modules: false,
    performance: false,
    reasons: false,
    timings: true,
    version: false,
  },
});
