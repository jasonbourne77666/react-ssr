import { merge } from 'webpack-merge';
import { Configuration } from 'webpack';
import common from './webpack.base';
import paths from '../paths';

export default merge<Configuration>(common, {
  name: 'client',
  entry: {
    client: paths.clientIndex,
  },
  devtool: 'cheap-module-source-map',
  output: {
    filename: '[name].js',
    path: paths.clientBuild,
    assetModuleFilename: 'images/[name].[contenthash:8].[ext]',
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
});
