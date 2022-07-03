import fs from 'fs';
import { Context, Next } from 'koa';

interface OptionsType {
  manifestPath: string;
  cache?: boolean;
  prependPath?: string;
}

let manifest: { [random: string]: any };
let options: OptionsType = { manifestPath: '', prependPath: '' };

/**
 *
 * @returns 读取文件
 */
function loadManifest() {
  if (manifest && options.cache) return manifest;
  // console.log(options.manifestPath);
  try {
    return JSON.parse(fs.readFileSync(options.manifestPath, 'utf8'));
  } catch (err) {
    throw new Error('Asset Manifest could not be loaded.');
  }
}

function splitAssets(manifest: object) {
  const css: string[] = [];
  const js: string[] = [];
  for (const key in manifest) {
    if (Object.prototype.hasOwnProperty.call(manifest, key)) {
      const element: string = manifest[key];
      if (element.endsWith('.js')) {
        js.push(javascriptTag(element));
      }
      if (element.endsWith('.css')) {
        css.push(stylesheetTag(element));
      }
    }
  }

  return { js, css };
}

function trimTag(str: string) {
  return str // replace double spaces not inside quotes
    .replace(/ {2,}(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)/, ' ') // replace extra space in opening tags
    .replace(/ >/, '>') // replace extra space in self closing tags
    .replace(/  \/>/, ' />');
}

/**
 * 拼接地址
 * @param source 资源名
 * @returns
 */
function lookup(source: string) {
  manifest = loadManifest();
  // console.log('manifest', manifest);
  // return manifest[source] ? options.prependPath + manifest[source] : '';
  return splitAssets(manifest);
}

/**
 * 获取资源
 * @returns
 */
function assetPath(source: string) {
  return lookup(source);
}

function getSources() {
  manifest = manifest || loadManifest();
  return Object.keys(manifest);
}

function javascriptTag(pathName: string) {
  return trimTag(`<script src="${pathName}"></script>`);
}

function stylesheetTag(pathName: string) {
  return trimTag(`<link rel="stylesheet" href="${pathName}"/>`);
}

export default (opts: OptionsType) => {
  options = { ...options, ...opts };
  return (ctx: Context, next: Next) => {
    ctx.assetPath = assetPath;
    next();
  };
};
