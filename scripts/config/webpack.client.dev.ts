import { merge } from 'webpack-merge';
import { Configuration } from 'webpack';
import common from './webpack.client.base';

export default merge<Configuration>(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
});
