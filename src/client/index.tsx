import React from 'react';
import ReactDOM from 'react-dom';
// import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '@/shared/App';
import AppContext from '@/shared/context/AppContext';

const MainApp = () => {
  return (
    <BrowserRouter>
      <AppContext context={context}>
        <App />
      </AppContext>
    </BrowserRouter>
  );
};

// 数据注水
const context = JSON.parse((document.getElementById('ssrTextInitData') as HTMLTextAreaElement).value);
// const container = document.querySelector('#root');

// Create a root.
ReactDOM.hydrate(<MainApp />, document.querySelector('#root'));

if (module && (module as any).hot && process.env.NODE_ENV === 'development') {
  if ((module as any).hot) {
    (module as any).hot.accept();
  }
  // if (!window.store) {
  //     window.store = store;
  // }
}
