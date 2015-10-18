import { UPDATE_AGGREGATORS, ADD_AGGREGATORS, REMOVE_AGGREGATORS } from '../constants/ActionTypes';
import { newListWithReplacementAtIndex, newListWithReplacementObjectAtIndex } from '../utils/reducerTools'

export default function aggregatorListSlots(state = [], action){
	switch (action.type) {
	case ADD_AGGREGATORS:
		var index = state.findIndex(slot => slot.id === action.entity.id);
		if (index !== -1){
			return newListWithReplacementAtIndex(state, index, () => ({ active: true, id: action.entity.id }) );
		}
		for (var i=0;i<state.length+1;i++){
			if (!state[i] || !state[i].active){
				return newListWithReplacementAtIndex(state, i, () => ({ active: true, id: action.entity.id }) );
			}
		}
	case UPDATE_AGGREGATORS:
		if (action.mutations && action.mutations.find(mutation => mutation.value === 'removed')){
			var index = state.findIndex(slot => slot.id === action.key);
			return makeRemoveList(state, index, action.key)
		}
		return state;
	case REMOVE_AGGREGATORS:
		var index = state.findIndex(slot => slot.id === action.key);
		return makeRemoveList(state, index, action.key)
	default:
		return state;
	}
}

function findLastFilledSlot(slots){
	for (var i = slots.length - 1; i >= 0; i--) {
		if (slots[i].active){
			return i;
		}
	};
	return false;
}

function makeRemoveList(state, index, id){
	if (index === -1) return state;

	var newList = [
	  ...state.slice(0, index),
	  ({active : false, id }),
	  ...state.slice(index + 1)
	];

	var lastFilledSlotIndex = findLastFilledSlot(newList);
	if (lastFilledSlotIndex !== false){
		return [ ...newList.slice(0, lastFilledSlotIndex+1) ]
	}
	return []
}