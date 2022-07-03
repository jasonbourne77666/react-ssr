import path from 'path';
import fs from 'fs';

// Get the working directory of the file executed by node
// 获取项目根目录
const appDirectory = fs.realpathSync(process.cwd());

/**
 * Resolve absolute path from relative path
 * @param {string} relativePath relative path
 */
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

// Default module extension
const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx'];

/**
 * Resolve module path
 * @param {function} resolveFn resolve function
 * @param {string} filePath file path
 */
function resolveModule(resolveFn, filePath) {
  // Check if the file exists
  const extension = moduleFileExtensions.find((ex) => fs.existsSync(resolveFn(`${filePath}.${ex}`)));

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }
  return resolveFn(`${filePath}.ts`); // default is .ts
}

export default {
  clientBuild: resolveApp('build/client'),
  serverBuild: resolveApp('build/server'),
  clientIndex: resolveModule(resolveApp, 'src/client/index'), // Package entry path
  serverIndex: resolveModule(resolveApp, 'src/server/index'), // Package entry path
  manifestPath: resolveApp('build/client'),
  appHtml: resolveApp('public/index.html'),
  appSrc: resolveApp('src'),
  appProxySetup: resolveModule(resolveApp, 'src/setProxy'),
  appPackageJson: resolveApp('package.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  moduleFileExtensions,
  publicPath: '/static/',
};
