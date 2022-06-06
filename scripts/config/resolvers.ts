import path from 'path';
import paths from '../paths';

export default {
  extensions: ['.tsx', '.ts', '.js', '.json'],
  alias: {
    '@': paths.appSrc,
    '@serverBuild': paths.serverBuild,
  },
};
