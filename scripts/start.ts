import rimraf from 'rimraf';
import paths from './paths';
// import { clientOnly } from './utils';

rimraf.sync(paths.clientBuild);
rimraf.sync(paths.serverBuild);

require('./start-ssr');
