import { merge } from 'webpack-merge';
import webpack from 'webpack';
import { Configuration } from 'webpack';
import common from './webpack.client.base';

export default merge<Configuration>(common, {
  mode: 'development',
  cache: {
    type: 'filesystem',
  },
  devtool: 'eval-cheap-module-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
