import { UPDATE_AGGREGATORS, ADD_AGGREGATORS, REMOVE_AGGREGATORS } from '../constants/ActionTypes';
import { newListWithReplacementAtIndex, newListWithReplacementObjectAtIndex } from '../utils/reducerTools'
import { Map, List, fromJS, is } from 'immutable'

export default function aggregatorListSlots(state = List(), action){
	switch (action.type) {
	case ADD_AGGREGATORS:
		var index = state.findIndex(slot => slot.get('id') === action.entity.id);
		if (index !== -1){
			return state.set(index, Map({ active: true, id: action.entity.id }))
		}
		for (var i=0;i<state.size+1;i++){
			if (!state.has(i) || !state.get(i).get('active')){
				return state.set(i, Map({ active: true, id: action.entity.id }))
			}
		}
	case UPDATE_AGGREGATORS:
		if (action.mutations && action.mutations.find(mutation => mutation.value === 'removed')){
			console.log('removing from slots', action.key)
			var index = state.findIndex(slot => slot.get('id') === action.key);
			return makeRemoveList(state, index, action.key)
		}
		return state;
	case REMOVE_AGGREGATORS:
		var index = state.findIndex(slot => slot.get('id') === action.key);
		return makeRemoveList(state, index, action.key)
	default:
		return state;
	}
}

function findLastFilledSlot(slots){
	for (var i = slots.size - 1; i >= 0; i--) {
		if (slots.get(i).get('active')){
			return i;
		}
	};
	return false;
}

function makeRemoveList(state, index, id){
	if (index === -1) return state;

	var newList = state.set(index, Map({active : false, id }));

	var lastFilledSlotIndex = findLastFilledSlot(newList);
	if (lastFilledSlotIndex !== false){
		return newList.slice(0, lastFilledSlotIndex+1)
	}
	return List()
}