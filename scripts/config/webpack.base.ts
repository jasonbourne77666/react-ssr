import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// 进度条
import WebpackBar from 'webpackbar';
import { Configuration } from 'webpack';
// 单独开启进程进行 ts 类型检查，优化打包速度
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import paths from '../paths';
import { isDevelopment, isProduction } from '../env';

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getCssLoaders = (importLoaders: number, modules = {}) => [
  isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
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

const config: Configuration = {
  cache: true,
  devtool: 'cheap-module-source-map',
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@': paths.appSrc,
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
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
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2?)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new WebpackBar({
      name: isDevelopment ? 'RUNNING' : 'BUNDLING',
      color: isDevelopment ? '#52c41a' : '#722ed1',
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        // 应用项目tsconfig地址
        configFile: paths.appTsConfig,
      },
    }),
  ],
};

export default config;
