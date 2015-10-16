import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import serverUpdater from '../middleware/serverUpdater'
import timeScrubber from '../middleware/timeScrubber'
import { batchedUpdatesMiddleware } from '../middleware/batchedUpdates'

export default function configureStore(initialState, socket, localHandlers) {
  const createStoreWithMiddleware = applyMiddleware(
    thunk,
    serverUpdater(socket, localHandlers),
    timeScrubber({ timeStoreName : "time", killLocalUpdates : true }),
    batchedUpdatesMiddleware
  )(createStore); 
  return createStoreWithMiddleware(rootReducer, initialState); 
}