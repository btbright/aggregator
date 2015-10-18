import { MOVE_TO_TIME, UPDATE_TIME } from '../constants/ActionTypes';
import { List } from 'immutable';
import { moveToTime } from '../actions/bufferedUpdates';

/*
	the timescrubber's job is to generate and dispatch the actions
	needed to get from t0 to tf. I wanted each scrubbable reducer to
	handle its own updates between times, but it's important that all
	reducers recieve all update actions, so they need to be dispatched
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

	  //TODO - the store itself should really define this
	  const simulationStores = ['aggregators'];
	  
	  const currentState = store.getState();

	  //generates list of updates to get from t0 to tf
	  const targetTime = action.time;
	  const timeState = timeSelector(currentState);
	  if (!timeState) throw new Error(`The timeScrubber middleware is set to depend on a time store (${timeStoreName}) but it is missing.`);
	  const currentTime	= action.fromTime || timeState.get('currentTime');
	  const isForwardMove = targetTime >= currentTime;
	  const scrubbableStoresKeys = scrubbableStoresKeysSelector(currentState);
	  let allUpdates = [];


	  scrubbableStoresKeys.forEach(scrubbableStoreKey => {
	  	let actionNamespace = scrubbableStoreKey.toUpperCase();
	  	let scrubbableStore = currentState[scrubbableStoreKey];
	  	let updates = scrubbableStore.get('updates');
	  	let missedUpdateKeys = scrubbableStore.get('missedUpdates');
	  	let storeUpdateKeys = List(updates.keys()).sort();
	  	let filteredKeys = storeUpdateKeys.filter(key => isForwardMove ? key <= targetTime && key > currentTime : key >= targetTime && key < currentTime);

	  	//if this is a ulility move to add in a missed update, we have to not rewind the update we never applied in the first place
	  	let filterOutMissedKeysForUtility = action.isUtilityMove && !isForwardMove ? filteredKeys.filter(k => !missedUpdateKeys.includes(k)) : filteredKeys;

	  	//if the server didn't provide an update for this time move, provide an
	  	//opportunity for reducers to simulate it
	  	if (!action.isUtilityMove && filterOutMissedKeysForUtility.size === 0 && simulationStores.indexOf(scrubbableStoreKey) !== -1){
	  		store.dispatch({
	  			type : `RUN_SIMULATIONS_${scrubbableStoreKey.toUpperCase()}`,
	  			currentTime,
	  			targetTime,
	  			activeClickerCount : currentState.room.activeClickerCount //obvious hack for aggregators
	  		});
	  	} else if (!action.isUtilityMove && scrubbableStore.get('simulations').size !== 0) {
	  		store.dispatch({
	  			type : `ROLL_BACK_SIMULATIONS_${scrubbableStoreKey.toUpperCase()}`
	  		});
	  	}

	  	//turn the keys around if it's backwards, so the most recent ones fire first
	  	let orderedKeys = isForwardMove ? filterOutMissedKeysForUtility : filterOutMissedKeysForUtility.reverse();

	  	//get updates by ordered keys
	  	const orderedUpdates = orderedKeys.map(key => updates.get(key)).flatten(1);

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

		if (!action.isUtilityMove && missedUpdateKeys.size > 0){
			console.log(`fixing ${missedUpdateKeys.size} misses`)
			var perfTime = Date.now();
			const oldestMissedUpdateKey = missedUpdateKeys.first();
			const oldestMissedUpdateKeyIndex = storeUpdateKeys.indexOf(oldestMissedUpdateKey);
			const rollbackTime = oldestMissedUpdateKeyIndex !== 0 ? storeUpdateKeys.get(oldestMissedUpdateKeyIndex - 1) - 10 : oldestMissedUpdateKey - 10;
			//move state back to right before missed update
			store.dispatch(moveToTime(rollbackTime, true))
			//play state forward back to now, with missed update included
			store.dispatch(moveToTime(currentTime, true, rollbackTime))
			
			console.log('fixing miss took: ',Date.now() - perfTime)

	  		renderedOrderedUpdates.push({
	  			type: `CLEAR_${actionNamespace}_MISSES`
	  		})
	  	}

	  	allUpdates = [...allUpdates, ...renderedOrderedUpdates]
	  });

	  if (!action.isUtilityMove){
	  	//updates currentTime
		store.dispatch({
		  type : UPDATE_TIME,
		  time : targetTime
		});
	  }

	  //dispatches those actions
	  allUpdates.forEach(store.dispatch);
	};
}