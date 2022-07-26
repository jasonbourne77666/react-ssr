import { configureStore, compose } from '@reduxjs/toolkit';
import usersReducer from './user/userSlice';

export const createStore = (defaultState = {}) => {
  const composeEnhancers =
    (typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  return configureStore({
    reducer: {
      users: usersReducer,
    },
    preloadedState: defaultState,
    enhancers: composeEnhancers,
  });
};
