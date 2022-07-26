import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './user/userSlice';

// const store = configureStore({
//   reducer: {
//     users: usersReducer,
//   },
// });

export default (defaultState = {}) => {
  return configureStore({
    reducer: {
      users: usersReducer,
    },
    preloadedState: defaultState,
  });
};

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;
