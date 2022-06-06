import { merge } from 'webpack-merge';
import { Configuration } from 'webpack';
import common from './webpack.client.base';

export default merge<Configuration>(common, {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
  },
});
