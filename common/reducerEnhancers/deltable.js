import { Map, List, fromJS, Seq } from 'immutable'


export default function deltable(reducer){

	const initialState = reducer(undefined, {});
	const namespace = `_${reducer.name.toUpperCase()}`;

	return function(state = initialState, action){
		if (!action || !action.type) return state;
		switch(action.type.replace(namespace, '')){
		case "ADD":
			if (Map.isMap(state)){
				return state.set(action.key.toString(), fromJS(action.entity));
			} else {
				return state.push(fromJS(action.entity));
			}
		case "REMOVE":
			if (Map.isMap(state)){
				return state.delete(action.key.toString());
			} else {
				return state.filter(obj => obj.get(action.keyField) !== action.key);
			}
		case "UPDATE":
			if (Map.isMap(state)){
				return state.set(action.key.toString(), state.get(action.key.toString()).withMutations(map => {
					action.mutations.forEach(mutation => mutate(map, mutation));
				}))
			} else {
				const index = state.indexOf(obj => obj.get(action.keyField) !== action.key);
				return state.set(index, state.get(index).withMutations(map => {
					action.mutations.forEach(mutation => mutate(map, mutation));
				}))
			}
		default:
			return state;
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