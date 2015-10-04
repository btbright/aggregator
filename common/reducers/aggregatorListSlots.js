import { RETIRE_AGGREGATOR, ADD_AGGREGATOR, UPDATE_AGGREGATOR_ID } from '../constants/ActionTypes';
import { newListWithReplacementAtIndex, newListWithReplacementObjectAtIndex } from '../utils/reducerTools'

export default function aggregatorListSlots(state = [], action){
	switch (action.type) {
	case ADD_AGGREGATOR:
		for (var i=0;i<state.length+1;i++){
			if (!state[i] || !state[i].active){
				return newListWithReplacementAtIndex(state, i, () => ({ active: true, id: action.aggregator.id }) );
			}
		}
	case RETIRE_AGGREGATOR:
		var index = state.findIndex(slot => slot.id === action.id);
		return [
		  ...state.slice(0, index),
		  ({active : false, id : action.id }),
		  ...state.slice(index + 1)
		]
	default:
		return state;
	}
}