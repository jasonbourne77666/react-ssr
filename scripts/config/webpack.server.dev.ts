import webpack, { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.server.base';

export default merge<Configuration>(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
