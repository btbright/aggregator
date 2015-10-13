import { ADD_UPDATES, MOVE_TO_TIME } from '../constants/ActionTypes'
import { Map, List, fromJS } from 'immutable'

export default function scrubbable(reducer, opts){

	const initialState = Map({
		isScrubbable : true,
		doesSimulate : opts && opts.doesSimulate,
		present : reducer(undefined, {}),
		updates : Map(),
		missedUpdates : List(),
		simulations : Map()
	});
	const namespace = `${opts && opts.namespace ? opts.namespace.toUpperCase() : reducer.name.toUpperCase()}`;
    
	return function(state = initialState, action){
		if (!action || !action.type) return state;
		const reducerState = state.get('present');

		switch(action.type){
		case `ADD_${namespace}_UPDATES`:
			let updatedState = standardUpdate(reducer, state, action,(updateState) => {
				updateState.updateIn(['updates',action.time], List(), updates => {
					const newObj = updates.concat(fromJS(action.updates))
					return newObj;
				})
			});
			return updatedState.update('missedUpdates', List(), missed => {
				return action.wasMissed ? missed.push(action.time) : missed;
			});

		case `CLEAR_${namespace}_MISSES`:
			return standardUpdate(reducer, state, action, (updateState) => {
				updateState.set('missedUpdates', List())
			}); 

		case `REMOVE_${namespace}`:
			const removeUpdateIndex = getUpdateIndex(state, action.time.toString(), action.key);
			const currentEntity = getReducerEntity(reducerState, action.key, action.keyField);

			return standardUpdate(reducer, state, action, (updateState) => {
				if (removeUpdateIndex !== -1 && currentEntity){
					updateState.mergeIn(['updates',action.time.toString(),removeUpdateIndex], { entity : currentEntity });
				}
			});

		case `UPDATE_${namespace}`:
			const updateUpdateIndex = getUpdateIndex(state, action.time.toString(), action.key);
			const currentEntityUpdate = getReducerEntity(reducerState, action.key, action.keyField);

			return standardUpdate(reducer, state, action, (updateState) => {
				if (updateUpdateIndex !== -1 && currentEntityUpdate){
					//get all the mutations on the update object stored by scrubbable
					const updateMutations = state.getIn(['updates',action.time.toString(),updateUpdateIndex,'mutations']);
					if (updateMutations){
						//update the mutations of the update to hold any current entity state, so we can go back
						const newMutations = updateMutations.map(mutation => {
							//a replacement mutation doesn't know what it is replacing, so we need to record it so
							//we can reverse it
							if (mutation.get('type') === "replacement"){
								return mutation.update('replaced',List(), replaced => replaced.push(currentEntityUpdate.get(mutation.get('property'))));
							}
							return mutation;
						})
						updateState.setIn(['updates',action.time.toString(),updateUpdateIndex,'mutations'], newMutations);
					}
				}
			});
		//dangerously sending sub-reducer the full state, 
		//but it needs to update the simulations list 
		case `RUN_SIMULATIONS_${namespace}`:
			return reducer(state, action);
		case `ROLL_BACK_SIMULATIONS_${namespace}`:
			return reducer(state, action);
		default:
			return standardUpdate(reducer, state, action);
		}
	}
}

function getUpdateIndex(state, key, updateKey){
	const entryResults = state.getIn(['updates', key], List()).findEntry(update => {
		return update.get('key') === updateKey;
	});
	if (entryResults){
		return entryResults[0];
	}
	return -1;
}

function getReducerEntity(state, key, keyField){
	return Map.isMap(state) ? state.get(key) : state.find(item => {
		return item.get(keyField) === key;
	});
}

function standardUpdate(reducer, state, action, mutationFunction){
	return state.withMutations(updateState => {
		updateState.update('present', present => reducer(present, action));
		if (mutationFunction){
			mutationFunction(updateState);
		}
	});
}