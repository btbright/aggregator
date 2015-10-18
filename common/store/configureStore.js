import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import serverUpdater from '../middleware/serverUpdater'
import timeScrubber from '../middleware/timeScrubber'
import { batchedUpdatesMiddleware } from '../middleware/batchedUpdates'

const logger = store => next => action => {
  const actionsTypesToLog = ['UPDATE_AGGREGATOR_SELECT_DESELECT']
  const reducersToLog = ['user']
  if (actionsTypesToLog.indexOf(action.type) !== -1){
  	console.log('dispatching action:',action)
  }
  let oldState = store.getState();
  let result = next(action);
  reducersToLog.forEach(reducer => {
  	let newState = store.getState()[reducer];
  	if (oldState[reducer] !== newState){
  		console.log('next state', newState);
  	}
  })
  return result;
};

export default function configureStore(initialState, socket, localHandlers) {
  const createStoreWithMiddleware = applyMiddleware(
    logger,
    thunk,
    serverUpdater(socket, localHandlers),
    timeScrubber({ timeStoreName : "time", killLocalUpdates : true }),
    batchedUpdatesMiddleware
  )(createStore); 
  return createStoreWithMiddleware(rootReducer, initialState); 
}