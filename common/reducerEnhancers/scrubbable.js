import { ADD_UPDATES, MOVE_TO_TIME } from '../constants/ActionTypes'
import { Map, List, fromJS, is } from 'immutable'
import diff from 'immutablediff'
import patch from 'immutablepatch'

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
			return state;
		default:
			if (action.time){
				let returnedState = state;
				const historyKeys = state.get('historyKeys');
				if (historyKeys.indexOf(action.time) === -1){
					const nextKeyIndex = findNextHistoryKeyIndex(historyKeys, action.time);
					if (!nextKeyIndex) {
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
//histories around it if they need it (so we can handle out of order updates)
function makeHistoryChanges(historyState, historyKeys, action, reducer){
	const previousHistoryKey = findPreviousHistoryKey(historyKeys, action.time);
	const previousHistory = historyState.get(previousHistoryKey)

	const currentHistory = historyState.get(action.time, previousHistory);
	const newCurrentHistory = reducer(currentHistory, action);
	//main update
	const withNewHistory = historyState.set(action.time, newCurrentHistory);

	//updates for future histories that need this update's info
	const nextHistoryKeyIndex = findNextHistoryKeyIndex(historyKeys, action.time);
	const withFutureChanges = withNewHistory.withMutations(mutableHistory => {
		if (nextHistoryKeyIndex){
			const called = pushUpdateForward(mutableHistory, historyKeys, nextHistoryKeyIndex, previousHistory, newCurrentHistory);
		}
	})
	return withFutureChanges;
}

function pushUpdateForward(historyState, historyKeys, currentKeyIndex, oldCurrentHistory, newCurrentHistory, called = 0){
	called++;
	const currentKey = historyKeys.get(currentKeyIndex);
	const nextHistory = historyState.get(currentKey);
	if (currentKeyIndex >= 0 && nextHistory){
		const previousDiff = diff(oldCurrentHistory, nextHistory);
		const updatedNextHistory = patch(newCurrentHistory, previousDiff);
		//size compare just for speed
		if (nextHistory.size !== updatedNextHistory.size || !is(nextHistory,updatedNextHistory)){
			historyState.set(currentKey, updatedNextHistory);
			return pushUpdateForward(historyState, historyKeys, currentKeyIndex-1, nextHistory, updatedNextHistory, called);
		}
	}
	return called;
}

/*
	historyKeysList ~= [1000,900,800,700,600,500,400,30,200,100]
*/

function findNextHistoryKeyIndex(historyKeysList, time){
	if (historyKeysList.first() < time) return;
	const timeIndex = historyKeysList.indexOf(time);
	if (timeIndex !== -1) return timeIndex-1;
	const firstSmallerIndex = historyKeysList.findIndex(k => k < time);
	//return the index of the last element
	if (firstSmallerIndex === -1) return historyKeysList.size - 1;
	return firstSmallerIndex-1;
}

function findPreviousHistoryKey(historyKeysList, time){
	if (historyKeysList.first() <= time) return historyKeysList.first();
	const timeIndex = historyKeysList.indexOf(time);
	if (timeIndex !== -1) return time;
	const firstSmallerIndex = historyKeysList.findIndex(k => k < time);
	return historyKeysList.get(firstSmallerIndex);
}






