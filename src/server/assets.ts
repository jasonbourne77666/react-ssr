export default function () {
  // 从 asset-manifest.json 读取资源
  const assetsMap: {
    [random: string]: string;
  } = require('@serverBuild/asset-manifest.json');
  const devHost = 'http://localhost:9001';

  const assets: {
    js: string[];
    css: string[];
  } = {
    js: [],
    css: [],
  };
  const isProd = process.env.__IS_PROD__ === 'true';

  for (const key in assetsMap) {
    if (Object.prototype.hasOwnProperty.call(assetsMap, key)) {
      const element = assetsMap[key];
      if (element.endsWith('.js')) {
        assets.js.push(`<script type="text/javascript"  src="${isProd ? element : devHost + element}"></script>`);
      }
      if (element.endsWith('.css')) {
        assets.css.push(`<link rel="stylesheet" type="text/css" href="${isProd ? element : devHost + element}" />`);
      }
    }
  }

  return assets;
}
