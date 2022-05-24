// 配置文件 用webpack打包服务端代码， /src/server

import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// 页面显示错误信息
// import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import { merge } from 'webpack-merge';
import common from './webpack.base';
import paths from '../paths';

import { isDevelopment, isProduction } from '../env';

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getCssLoaders = (importLoaders: number, modules = {}) => [
  'isomorphic-style-loader',
  {
    loader: 'css-loader',
    options: {
      modules,
      sourceMap: isDevelopment,
      importLoaders,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          require('postcss-flexbugs-fixes'),
          isProduction && [
            'postcss-preset-env',
            {
              autoprefixer: {
                grid: true,
                flexbox: 'no-2009',
              },
              stage: 3,
            },
          ],
        ].filter(Boolean),
      },
    },
  },
];

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
  module: {
    rules: [
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: getCssLoaders(1),
      },
      {
        test: cssModuleRegex,
        use: getCssLoaders(1, {
          mode: 'local',
          auto: true,
          localIdentName: '[path]__[local]--[hash:base64:5]',
        }),
      },
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: sassModuleRegex,
        use: [
          ...getCssLoaders(2, {
            mode: 'local',
            auto: true,
            localIdentName: '[path]__[local]--[hash:base64:5]',
          }),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
    ],
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
