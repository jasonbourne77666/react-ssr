import { Context, Next } from 'koa';
import { createStore } from '../../shared/store';

const addStore = (ctx: Context, next: Next): void => {
  ctx.reactStore = createStore();
  next();
};

export default addStore;
