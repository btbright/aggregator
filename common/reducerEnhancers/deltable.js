import { Map, List, fromJS } from 'immutable'

export default function deltable(reducer, opts){

	const initialState = reducer(undefined, {});
	const namespace = `${opts && opts.namespace ? opts.namespace : reducer.name.toUpperCase()}`;

	return function(state = initialState, action){
		if (!action || !action.type) return state;
		switch(action.type){
		case `ADD_${namespace}`:
			if (Map.isMap(state)){
				//skip add if it exists already
				if (action.key && state.has(action.key.toString())) return state;
				return state.set(action.key.toString(), fromJS(action.entity));
			} else {
				//replace if it exists already
				if (action.keyField && action.key){ 
					const entityIndex = state.findIndex(obj => obj.get(action.keyField) === action.key)
					if (entityIndex !== -1){
						return state.set(entityIndex, fromJS(action.entity))
					}
				}
				return state.push(fromJS(action.entity));
			}
		case `REMOVE_${namespace}`:
			if (Map.isMap(state)){
				return state.delete(action.key.toString());
			} else {
				return state.filter(obj => obj.get(action.keyField) !== action.key);
			}
		case `UPDATE_${namespace}`:
			if (Map.isMap(state)){
				if (!state.has(action.key.toString())) return state;
				return state.set(action.key.toString(), state.get(action.key.toString()).withMutations(map => {
					action.mutations.forEach(mutation => map.set(mutation.property, mutation.value));
				}))
			} else {
				const findResults = state.findEntry(obj => obj.get(action.keyField) === action.key);
				if (!findResults) return state;
				const [index, entity] = findResults;
				return state.set(index, state.get(index).withMutations(map => {
					action.mutations.forEach(mutation => map.set(mutation.property, mutation.value));
				}))
			}
		default:
			return reducer(state, action);
		}
	}
}