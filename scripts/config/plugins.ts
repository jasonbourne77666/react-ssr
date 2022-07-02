import path from 'path';
import webpack from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// 单独开启进程进行 ts 类型检查，优化打包速度
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import paths from '../paths';

import { isProduction } from '../env';

export const shared = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: !isProduction ? '[name].css' : 'css/[name].[contenthash:8].css',
    chunkFilename: !isProduction ? '[id].css' : 'css/[id].[contenthash:8].css',
  }),
];

export const client = [
  new webpack.DefinePlugin({
    'process.env.__IS_PROD__': String(isProduction),
    'process.env.__SERVER__': 'false',
    'process.env.__BROWSER__': 'true',
  }),
  new WebpackManifestPlugin({
    fileName: 'manifest.json',
  }),
  new ForkTsCheckerWebpackPlugin({
    typescript: {
      // 应用项目tsconfig地址
      configFile: paths.appTsConfig,
    },
  }),
].filter(Boolean);

export const server = [
  new webpack.DefinePlugin({
    'process.env.__IS_PROD__': String(isProduction),
    'process.env.__SERVER__': 'true',
    'process.env.__BROWSER__': 'false',
  }),
  new ForkTsCheckerWebpackPlugin({
    typescript: {
      // 应用项目tsconfig地址
      configFile: paths.appTsConfig,
    },
  }),
];

export default {
  shared,
  client,
  server,
};
