import { ADD_UPDATE, MOVE_TO_TIME } from '../constants/ActionTypes'
import { Map, List, fromJS } from 'immutable'

export default function scrubbable(reducer, opts){

	const initialState = Map({
		isScrubbable : true,
		present : reducer(undefined, {}),
		updates : Map()
	});
	const namespace = `_${opts && opts.namespace ? opts.namespace : reducer.name.toUpperCase()}`;
    
	return function(state = initialState, action){
		if (!action || !action.type) return state;
		const reducerState = state.get('present');
		if (!Map.isMap(reducerState) && !List.isList(reducerState)){
			throw new Error(`The state of the enhanced reducer (${reducer.name}) must be an Immutable Map or List`);
		}

		switch(action.type){
		case ADD_UPDATE:
			if (action.namespace !== reducer.name) return state;
			return state.updateIn(['updates',action.time], List(), updates => updates.push(fromJS(action.update)));

		case `REMOVE${namespace}`:
			const removeUpdateIndex = getUpdateIndex(state, action.time.toString(), action.key);
			const currentEntity = getReducerEntity(reducerState, action.key, action.keyField);

			return standardUpdate(reducer, state, action, (updateState) => {
				if (removeUpdateIndex !== -1 && currentEntity){
					updateState.mergeIn(['updates',action.time.toString(),removeUpdateIndex], { entity : currentEntity });
				}
			});

		case `UPDATE${namespace}`:
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