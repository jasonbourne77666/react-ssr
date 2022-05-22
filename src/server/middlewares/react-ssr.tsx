//完成 react ssr 工作的中间件,组件在服务端渲染的逻辑都在这个文件内

//引入Index 组件
import React from 'react';
import { Context, Next } from 'koa';
//引入index 组件
import App from '../../client/App';
import { renderToString } from 'react-dom/server';

export default (ctx: Context, next: Next) => {
  const html = renderToString(<App />);

  ctx.body = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>my react ssr</title>
  </head>
  <body>
      <div id="root">${html}</div>
  </body>
  </html>
  <script type="text/javascript"  src="client.js"></script>
  `;

  return next();
};
