import { MOVE_TO_TIME } from '../constants/ActionTypes';

export default function timeScrubber(opts) {

	return store => next => action => {
	  //intercepts only change time actions
	  if (action.type !== MOVE_TO_TIME || false){
	  	return next(action);
	  }

	  const timeStoreName = opts && opts.timeStoreName ? opts.timeStoreName : "time";
	  const timeSelector = state => state[timeStoreName];
	  const simulatingStoresKeysSelector = state => Object.keys(state).filter(storeKey => {
	  	return state[storeKey] && typeof state[storeKey].get === 'function' && state[storeKey].get('doesSimulate') === true;
	  });

	  const currentState = store.getState();

	  //generates list of updates to get from t0 to tf
	  const targetTime = action.time;
	  const timeState = timeSelector(currentState);
	  if (!timeState) throw new Error(`The timeScrubber middleware is set to depend on a time store (${timeStoreName}) but it is missing.`);
	  const currentTime	= action.fromTime || timeState.get('currentTime');
	  const isForwardMove = targetTime >= currentTime;
	  //const simulatingStoresKeys = simulatingStoresKeysSelector(currentState); <-- performance hit strangely
	  const simulatingStoresKeys = ['aggregators']

	  simulatingStoresKeys.forEach(simulatingStoresKey => {
	  	let simulatingStore = currentState[simulatingStoresKey];
	  	let history = simulatingStore.get('history');
	  	if (!history.has(targetTime) && isForwardMove){
	  		//if the server didn't provide an update for this time move, provide an
		  	//opportunity for reducers to simulate it
		  	store.dispatch({
	  			type : `RUN_SIMULATIONS_${simulatingStoresKey.toUpperCase()}`,
	  			currentTime,
	  			targetTime,
	  			activeClickerCount : currentState.room.activeClickerCount //obvious hack for aggregators
	  		});
	  	}
	  });

	  return next(action);
	};
}