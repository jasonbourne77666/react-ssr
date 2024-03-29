import React from 'react';
import ReactDOM from 'react-dom';
// import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from '../shared/store';

import App from '@/shared/App';
import AppContext from '@/shared/context/AppContext';

// 数据注水
const context = JSON.parse((document?.getElementById('ssrTextInitData') as HTMLTextAreaElement).value);
// const container = document.querySelector('#root');

//得到 store 对象
const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Create a root.
ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <AppContext context={context}>
        <App />
      </AppContext>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root'),
);

if (module && (module as any).hot && process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot.accept();
}
