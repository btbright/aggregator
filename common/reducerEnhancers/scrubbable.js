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
			return state
		default:
			if (action.time){
				if (action.type === 'UPDATE_AGGREGATORS' && (reducer.name || opts && opts.namespace.toLowerCase()) === 'aggregators'){
					if (action.mutations.find(m => m.value === 'retired')){
						console.log(action.time, 'RETIRED', action.key)
					}
					if (action.mutations.find(m => m.value === 'removed')){
						console.log(action.time, 'REMOVED', action.key)
					}
				}
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
		if (nextHistoryKeyIndex >= 0){
			const diffToPush = diff(currentHistory, newCurrentHistory);
			const called = pushUpdateForward(mutableHistory, historyKeys, nextHistoryKeyIndex, previousHistory, newCurrentHistory, diffToPush);
		}
	})
	return withFutureChanges;
}

function pushUpdateForward(fullState, stateKeys, nextStateKeyIndex, oldState, updatedState, masterDiff, called = 0){
	called++;
	const nextStateKey = stateKeys.get(nextStateKeyIndex);
	const nextState = fullState.get(nextStateKey);
	if (nextStateKeyIndex >= 0 && nextState){
		const previousDiff = diff(oldState, nextState);
		const previousDiffPaths = previousDiff.map(ops => ops.get('path'))
		console.log(oldState, nextState)
		previousDiffPaths.forEach(path => {
			console.log('previousDiffPaths',nextStateKey,path)
		})

		masterDiff.forEach(diff => {
			console.log('masterDiff',nextStateKey,diff.path, diff)
		})

		//if the property is changing anyway, don't override the server - it knows
		const diffsToApply = masterDiff.map(ops => {
			return !previousDiffPaths.includes(ops.get('path')) ? ops : false
		}).filter(ops => ops !== false);
		diffsToApply.forEach(diff => {
			console.log('diffsToApply',nextStateKey,diff.path, diff)
		})
		const updatedNextState = patch(nextState, diffsToApply);

		//size compare just for speed
		if (diffsToApply.size > 0 && nextState.size !== updatedNextState.size || !is(nextState, updatedNextState)){
			fullState.set(nextStateKey, updatedNextState);
			return pushUpdateForward(fullState, stateKeys, nextStateKeyIndex-1, nextState, updatedNextState, diffsToApply, called);
		}
	}
	return called;
}

/*
	historyKeysList ~= [1000,900,800,700,600,500,400,300,200,100]
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






