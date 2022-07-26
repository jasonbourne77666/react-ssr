//完成 react ssr 工作的中间件,组件在服务端渲染的逻辑都在这个文件内

//引入Index 组件
import React from 'react';
import { Context, Next } from 'koa';
import AppContext from '@/shared/context/AppContext';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { matchRoutes, RouteObject, RouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';

//引入index 组件
import App from '@/shared/App';
import getStore from '../../shared/store';
import { routes } from '@/shared/pages/rooter';
// import { getInitialData } from '@/shared/getInitialData';

interface NewRouteObject extends RouteObject {
  getInitialProps?: () => Promise<any>;
}

const handleInitialProps = async (routeList: RouteMatch<string>[] | null): Promise<any> => {
  let result = {};
  if (Array.isArray(routeList) && routeList.length) {
    const { route } = routeList[0];
    const getInitialProps = (route as NewRouteObject).getInitialProps;
    if (typeof getInitialProps === 'function') {
      result = await getInitialProps();
    }
  }

  return result ? result : {};
};

export default async (ctx: Context, next: Next) => {
  const { url = '' } = ctx.req;
  let assetPath = {
    js: [],
    css: [],
  };
  //得到静态资源
  if (ctx.assetPath) {
    assetPath = ctx.assetPath();
  }

  if (url === '/favicon.ico' || url.includes('.js')) {
    return next();
  }

  const routeList = matchRoutes(routes, url);

  // 来自pages的预置数据
  const pageData = await handleInitialProps(routeList);

  const store = getStore();

  const context = {
    pageData,
    // store: store.getState(),
  };

  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={url}>
        <AppContext context={context}>
          <App />
        </AppContext>
      </StaticRouter>
    </Provider>,
  );

  //得到组件的序列化数据
  const helmet = Helmet.renderStatic();

  ctx.body = `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${assetPath.css.join('')}
      </head>
      <body>
          <div id="root">${html}</div>
          <textarea id="ssrTextInitData" style="display:none;">
            ${JSON.stringify(context)}
          </textarea>
          ${assetPath.js.join('')}
      </body>
    </html>
  `;
  return next();
};
