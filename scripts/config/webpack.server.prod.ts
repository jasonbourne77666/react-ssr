import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.server.base';

export default merge<Configuration>(common, {
  mode: 'production',
  devtool: false,
});
