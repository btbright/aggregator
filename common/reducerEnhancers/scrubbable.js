import { ADD_UPDATE, MOVE_TO_TIME } from '../constants/ActionTypes'
import { Map, List, fromJS } from 'immutable'


export default function scrubbable(reducer){

	const initialState = Map({
		present : reducer(undefined, {}),
		updates : Map()
	});
	const namespace = `_${reducer.name.toUpperCase()}`;
    
	return function(state = initialState, action){
		if (!action || !action.type) return state;
		switch(action.type){
		case ADD_UPDATE:
			if (action.namespace !== reducer.name) return state;
			return state.updateIn(['updates',action.time], List(), updates => 
				updates.push(fromJS(action.update))
				);

		case `ADD${namespace}`: 
			//grab the key off the entity and add it to the update so we know
			//which entity to remove when going backwards if it is in a list
			const entryResults = state.getIn(['updates',action.time.toString()], List()).findEntry(update => {
				return update.getIn(['entity',action.keyField]) === action.entity[action.keyField];
			});
			
			if (entryResults){
				const [index, update] = entryResults;
				return state.withMutations(updateState => {
					updateState.mergeIn(['updates',action.time.toString(),index], { key : action.entity[action.keyField] });
					updateState.update('present', present => reducer(present, action));
				});
			}
			return state.update('present', present => reducer(present, action));
		default:
			return state.update('present', present => reducer(present, action));
		}
	}
}