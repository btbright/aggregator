import { MOVE_TO_TIME, UPDATE_TIME } from '../constants/ActionTypes';
import { List } from 'immutable';

/*
	the timescrubber's job is to generate and dispatch the actions
	needed to get from t0 to tf. I wanted each scrubbable reducer to
	handle its own updates between times, but it's important that all
	reducers recieve all update actions, so they need to be dispatched. console.log(
*/
export default function timeScrubber(opts) {

	return store => next => action => {
	  //intercepts only change time actions
	  if (action.type !== MOVE_TO_TIME){
	  	return next(action);
	  }

	  const timeStoreName = opts && opts.timeStoreName ? opts.timeStoreName : "time";
	  const timeSelector = state => state[timeStoreName];
	  const scrubbableStoresKeysSelector = state => Object.keys(state).filter(storeKey => {
	  	return state[storeKey] && typeof state[storeKey].get === 'function' && state[storeKey].get('isScrubbable') === true;
	  });
	  
	  const currentState = store.getState();

	  //generates list of updates to get from t0 to tf
	  const targetTime = action.time;
	  const timeState = timeSelector(currentState);
	  if (!timeState) throw new Error(`The timeScrubber middleware is set to depend on a time store (${timeStoreName}) but it is missing.`);
	  const currentTime	= timeState.get('currentTime');
	  const isForwardMove = targetTime > currentTime;
	  const scrubbableStoresKeys = scrubbableStoresKeysSelector(currentState);
	  let allUpdates = [];

	  scrubbableStoresKeys.forEach(scrubbableStoreKey => {
	  	let actionNamespace = scrubbableStoreKey.toUpperCase();
	  	let scrubbableStore = currentState[scrubbableStoreKey];
	  	let updates = scrubbableStore.get('updates');
	  	let storeUpdateKeys = List(updates.keys());
	  	let filteredKeys = storeUpdateKeys.filter(key => isForwardMove ? key <= targetTime && key >= currentTime : key >= targetTime && key <= currentTime);
	  	let orderedKeys = isForwardMove ? filteredKeys : filteredKeys.reverse();

	  	//get updates by ordered keys
	  	const orderedUpdates = orderedKeys
	  							.map(key => {
	  								var update = updates.get(key).toJS()[0]
	  								update.time = key;
	  								update.isUpdateAction = true;
	  								return update;
	  							})
	  							.flatten(1);


	  	//transforms actions into plain objects
	  	const renderedOrderedUpdates = orderedUpdates.toJS();

	  	//reverse the actions, if needed
		if (!isForwardMove){
			renderedOrderedUpdates.forEach(action => {
				if (action.type === `UPDATE_${actionNamespace}`){
					action.mutations.forEach(mutation => {
						if (mutation.type === 'addition'){
							mutation.value = -mutation.value;
						} else if (mutation.type === 'replacement'){
							mutation.value = mutation.replaced.pop();
						}
					});
				} else if (action.type === `ADD_${actionNamespace}`){
					action.type = `REMOVE_${actionNamespace}`;
				} else if (action.type === `REMOVE_${actionNamespace}`){
					action.type = `ADD_${actionNamespace}`;
				}
			});
		}
	  	allUpdates = [...allUpdates, ...renderedOrderedUpdates]
	  });

	  //updates currentTime
	  store.dispatch({
	  	type : UPDATE_TIME,
	  	time : targetTime
	  });

	  //dispatches those actions
	  allUpdates.forEach(store.dispatch);
	};
}