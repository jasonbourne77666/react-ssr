import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { isDevelopment, isProduction } from '../env';

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

const cssModuleOptions = { localIdentName: isProduction ? '[hash:base64:8]' : '[path]__[local]--[hash:base64:5]' };

const babelLoader = {
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
  },
};

const getCssLoaders = (importLoaders: number, modules = {}) => [
  MiniCssExtractPlugin.loader,
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
          [
            'autoprefixer',
            {
              grid: true,
              flexbox: 'no-2009',
            },
          ],
        ],
      },
    },
  },
];

const cssModuleLoaderClient = {
  test: cssModuleRegex,
  use: [
    // 'css-hot-loader',
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: cssModuleOptions,
        importLoaders: 1,
      },
    },
    {
      loader: 'postcss-loader',
    },
  ],
};

const cssLoaderClient = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: [
    // 'css-hot-loader',
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
    },
  ],
};

const cssModuleLoaderServer = {
  test: cssModuleRegex,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: cssModuleOptions,
      },
    },
    {
      loader: 'postcss-loader',
    },
  ],
};

const cssLoaderServer = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
    },
  ],
};

const urlLoaderClient = {
  test: /\.(png|jpe?g|gif|svg)$/,
  loader: 'url-loader',
  options: {
    limit: 2048,
    name: 'assets/[name].[hash:8].[ext]',
  },
};

const urlLoaderServer = {
  ...urlLoaderClient,
  options: {
    ...urlLoaderClient.options,
    emitFile: false,
  },
};

const fileLoaderClient = {
  exclude: [/\.(js|jsx|ts|tsx|css|mjs|html|ejs|json)$/],
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'assets/[name].[hash:8].[ext]',
      },
    },
  ],
};

const fileLoaderServer = {
  exclude: [/\.(js|jsx|ts|tsx|css|mjs|html|ejs|json)$/],
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'assets/[name].[hash:8].[ext]',
        emitFile: false,
      },
    },
  ],
};

export const client = [
  {
    oneOf: [babelLoader, cssModuleLoaderClient, cssLoaderClient, urlLoaderClient, fileLoaderClient],
  },
];

export const server = [
  {
    oneOf: [babelLoader, cssModuleLoaderServer, cssLoaderServer, urlLoaderServer, fileLoaderServer],
  },
];

export default { client, server };
