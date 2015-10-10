import { UPDATE_AGGREGATORS, ADD_AGGREGATORS } from '../constants/ActionTypes';
import { newListWithReplacementAtIndex, newListWithReplacementObjectAtIndex } from '../utils/reducerTools'

export default function aggregatorListSlots(state = [], action){
	switch (action.type) {
	case ADD_AGGREGATORS:
		for (var i=0;i<state.length+1;i++){

			if (state[i] && state[i].id === action.entity.id){
				return state;
			}

			if (!state[i] || !state[i].active){
				return newListWithReplacementAtIndex(state, i, () => ({ active: true, id: action.entity.id }) );
			}
		}
	case UPDATE_AGGREGATORS:
		if (action.mutations && action.mutations.find(mutation => mutation.value === 'removed')){
			var index = state.findIndex(slot => slot.id === action.key);
			var newList = [
			  ...state.slice(0, index),
			  ({active : false, id : action.key }),
			  ...state.slice(index + 1)
			];

			var lastFilledSlotIndex = findLastFilledSlot(newList);
			if (lastFilledSlotIndex !== false){
				return [ ...newList.slice(0, lastFilledSlotIndex+1) ]
			}
			return []
		}
		return state;
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