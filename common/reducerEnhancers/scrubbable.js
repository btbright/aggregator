import { ADD_UPDATES, MOVE_TO_TIME } from '../constants/ActionTypes'
import { Map, List } from 'immutable'
import { getFutureKeys, findPreviousHistoryKey, findNextHistoryKeyIndex } from '../utils/historyListHelpers'

export default function scrubbable(reducer, opts){

	const initialState = Map({
		isScrubbable : true,
		doesSimulate : opts && opts.doesSimulate || false,
		present : reducer(undefined, {}),
		currentPresentKey : 0,
		history : Map(),
		historyKeys : List(),
		orphanedUpdates : Map()
	});
    
	return function(state = initialState, action){
		if (!action || !action.type) return state;

		switch(action.type){
		case MOVE_TO_TIME:
			const historyState = state.get('history');
			const lastHistoryKeyBeforeTime = findPreviousHistoryKey(state.get('historyKeys'), action.time);
			if (lastHistoryKeyBeforeTime > state.get('currentPresentKey')){
				const lastHistoryBeforeNewTime = historyState.get(lastHistoryKeyBeforeTime, state.get('present'))
				return state.set('present', lastHistoryBeforeNewTime).set('currentPresentKey', lastHistoryKeyBeforeTime);	
			}
			return state
		default:
			if (action.time){
				let returnedState = state;
				const historyKeys = state.get('historyKeys');
				if (historyKeys.indexOf(action.time) === -1){
					const nextKeyIndex = findNextHistoryKeyIndex(historyKeys, action.time);
					if (typeof nextKeyIndex === 'undefined') {
						returnedState = state.update('historyKeys', historyKeys => historyKeys.unshift(action.time));
					} else {
						returnedState = state.update('historyKeys', historyKeys => historyKeys.splice(nextKeyIndex+1,0,action.time));
					}
				}
				return returnedState.update('history', historyState => {
					return makeHistoryChanges(historyState, historyKeys, action, reducer);
				});
			} else {
				return state.update('present', present => reducer(present, action));
			}
		}
	}
}

//make the changes to the correct place in the timeline, updating
//future histories if they need it (so we can handle out of order updates)
function makeHistoryChanges(historyState, historyKeys, action, reducer){
	const previousHistoryKey = findPreviousHistoryKey(historyKeys, action.time);
	const previousHistory = historyState.get(previousHistoryKey)

	const currentHistory = historyState.get(action.time, previousHistory);
	const newCurrentHistory = reducer(currentHistory, action);
	//main update
	const withNewHistory = historyState.set(action.time, newCurrentHistory);

	//updates for future histories that need this update's info
	const futureKeys = getFutureKeys(historyKeys, action.time);
	const withFutureChanges = withNewHistory.withMutations(mutableHistory => {
		futureKeys.forEach(key => {
			mutableHistory.set(key, reducer(mutableHistory.get(key), action));
		});	
	})
	return withFutureChanges;
}