import React from 'react';
// import ReactDOM from 'react-dom';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '@/shared/App';
import AppContext from '@/shared/context/AppContext';

function clientRender() {
  // 数据注水
  const context = JSON.parse((document.getElementById('ssrTextInitData') as HTMLTextAreaElement).value);
  const container = document.querySelector('#root');
  hydrateRoot(
    container!,
    <BrowserRouter>
      <AppContext context={context}>
        <App />
      </AppContext>
    </BrowserRouter>,
  );
}
clientRender();
