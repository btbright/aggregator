import { addons } from 'react/addons';

//adapted from https://github.com/acdlite/redux-batched-updates/blob/master/src/index.js
export function batchedUpdatesMiddleware() {
  return next => action => addons.batchedUpdates(() => next(action));
}