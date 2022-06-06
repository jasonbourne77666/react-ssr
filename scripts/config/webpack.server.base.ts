import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { merge } from 'webpack-merge';
import paths from '../paths';
import { server as serverLoaders } from './loaders';
import resolvers from './resolvers';
import plugins from './plugins';

export default merge<Configuration>(
  {},
  {
    name: 'server',
    target: 'node',
    entry: {
      server: paths.serverIndex,
    },
    // 排除不需要打包的模块，因为 node 端会自动载入这些包，可以让打包的文件更小。
    externals: [nodeExternals({ allowlist: /\.(scss|css)$/ })],
    module: {
      rules: serverLoaders,
    },
    resolve: { ...resolvers },
    plugins: [...plugins.shared, ...plugins.server],
    output: {
      filename: 'server.js',
      path: paths.serverBuild,
      publicPath: '/',
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
  },
);
