import { Map, List, fromJS, Seq } from 'immutable'

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
				//skip add if it exists already
				if (action.keyField && action.key && state.find(entity => entity.get(action.keyField) === action.key)) return state;
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
					action.mutations.forEach(mutation => mutate(map, mutation));
				}))
			} else {
				const findResults = state.findEntry(obj => obj.get(action.keyField) === action.key);
				if (!findResults) return state;
				const [index, entity] = findResults;
				return state.set(index, state.get(index).withMutations(map => {
					action.mutations.forEach(mutation => mutate(map, mutation));
				}))
			}
		default:
			return reducer(state, action);
		}
	}
}

function mutate(state, action){
	switch(action.type){
	case "addition":
		return state.set(action.property, state.get(action.property) + action.value);
	case "replacement":
		return state.set(action.property, action.value);
	default:
		return state;
	}
}