import { merge } from 'webpack-merge';
import { Configuration } from 'webpack';
import paths from '../paths';
import path from 'path';
import { client as clientLoaders } from './loaders';
import resolvers from './resolvers';
import plugins from './plugins';

export default merge<Configuration>(
  {},
  {
    name: 'client',
    target: 'web',
    entry: {
      client: [paths.clientIndex],
    },
    output: {
      filename: '[name].js',
      path: path.join(paths.clientBuild, paths.publicPath),
      chunkFilename: '[name].[chunkhash:8].chunk.js',
      publicPath: paths.publicPath,
    },
    module: {
      rules: clientLoaders,
    },
    resolve: { ...resolvers },
    plugins: [...plugins.shared, ...plugins.client],
    optimization: {
      splitChunks: {
        cacheGroups: {
          libs: {
            // 抽离第三方库
            test: /node_modules/, // 指定node_modules下的包
            chunks: 'all',
            name: 'libs', // 打包后的文件名
          },
        },
      },
    },
    stats: {
      cached: false,
      cachedAssets: false,
      chunks: false,
      chunkModules: false,
      children: false,
      colors: true,
      hash: false,
      modules: false,
      reasons: false,
      timings: true,
      version: false,
    },
  },
);
