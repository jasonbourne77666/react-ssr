import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {} from 'css-loader';
import { isDevelopment, isProduction } from '../env';

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const cssModuleOptions = { localIdentName: isProduction ? '[hash:base64:8]' : '[path]__[local]--[hash:base64:5]' };

const babelLoader = {
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
  },
};

// css-loader and postcss-loader
const getCssLoaders = (cssOptions: any) => {
  const loaders = [
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          config: false,
          plugins: [
            'postcss-flexbugs-fixes',
            [
              'postcss-preset-env',
              {
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              },
            ],
            // Adds PostCSS Normalize as the reset css with default options,
            // so that it honors browserslist config in package.json
            // which in turn let's users customize the target behavior as per their needs.
            'postcss-normalize',
          ],
        },
        sourceMap: isDevelopment,
      },
    },
  ].filter(Boolean);

  return loaders;
};

const cssModuleLoaderClient = {
  test: cssModuleRegex,
  use: [
    'css-hot-loader',
    MiniCssExtractPlugin.loader,
    ...getCssLoaders({
      importLoaders: 1,
      sourceMap: isDevelopment,
      modules: {
        mode: 'local',
        ...cssModuleOptions,
      },
    }),
  ],
};

const cssLoaderClient = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: [
    'css-hot-loader',
    ...getCssLoaders({
      importLoaders: 1,
      sourceMap: isDevelopment,
      modules: {
        mode: 'local',
        ...cssModuleOptions,
      },
    }),
  ],
};

const cssModuleLoaderServer = {
  test: cssModuleRegex,
  use: [
    MiniCssExtractPlugin.loader,
    ...getCssLoaders({
      importLoaders: 1,
      sourceMap: isDevelopment,
      modules: {
        mode: 'local',
        ...cssModuleOptions,
      },
    }),
  ],
};

const cssLoaderServer = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: [
    MiniCssExtractPlugin.loader,
    ...getCssLoaders({
      importLoaders: 1,
      sourceMap: isDevelopment,
      modules: {
        mode: 'local',
        ...cssModuleOptions,
      },
    }),
  ],
};

const scssModuleLoaderClient = {
  test: sassModuleRegex,
  use: [
    'css-hot-loader',
    MiniCssExtractPlugin.loader,
    ...getCssLoaders({
      importLoaders: 1,
      sourceMap: isDevelopment,
      modules: {
        mode: 'local',
        ...cssModuleOptions,
      },
    }),
    'sass-loader',
  ],
};

const scssLoaderClient = {
  test: sassRegex,
  exclude: sassModuleRegex,
  use: [
    'css-hot-loader',
    ...getCssLoaders({
      importLoaders: 1,
      sourceMap: isDevelopment,
      modules: {
        mode: 'local',
        ...cssModuleOptions,
      },
    }),
    'sass-loader',
  ],
};

const scssModuleLoaderServer = {
  test: sassModuleRegex,
  use: [
    MiniCssExtractPlugin.loader,
    ...getCssLoaders({
      importLoaders: 1,
      sourceMap: isDevelopment,
      modules: {
        mode: 'local',
        ...cssModuleOptions,
      },
    }),
    'sass-loader',
  ],
};

const scssLoaderServer = {
  test: sassRegex,
  exclude: sassModuleRegex,
  use: [
    MiniCssExtractPlugin.loader,
    ...getCssLoaders({
      importLoaders: 1,
      sourceMap: isDevelopment,
      modules: {
        mode: 'local',
        ...cssModuleOptions,
      },
    }),
    'sass-loader',
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
    // oneOf 仅执行此数组中的第一个匹配规则
    oneOf: [
      babelLoader,
      scssModuleLoaderClient,
      scssLoaderClient,
      cssModuleLoaderClient,
      cssLoaderClient,
      urlLoaderClient,
      fileLoaderClient,
    ],
  },
];

export const server = [
  {
    // oneOf 仅执行此数组中的第一个匹配规则
    oneOf: [
      babelLoader,
      scssModuleLoaderServer,
      scssLoaderServer,
      cssModuleLoaderServer,
      cssLoaderServer,
      urlLoaderServer,
      fileLoaderServer,
    ],
  },
];

export default { client, server };
