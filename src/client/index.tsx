import React from 'react';
// import ReactDOM from 'react-dom';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '../shared/App';
// import './global.css';

const container = document.querySelector('#root');
hydrateRoot(
  container!,
  <BrowserRouter>
    <App />
  </BrowserRouter>,
); // createRoot(container!) if you use TypeScript

// ReactDOM.hydrate(<App />, document.getElementById('root'));

// if ((module as any).hot) {
//   (module as any).hot.accept();
// }
