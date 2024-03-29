import { UPDATE_AGGREGATORS, ADD_AGGREGATORS, REMOVE_AGGREGATORS } from '../constants/ActionTypes';
import { Map, List } from 'immutable'

export default function aggregatorListSlots(state = List(), action){
	switch (action.type) {
	case ADD_AGGREGATORS:
		if (action.entity.objectType !== 'message') return state;
		//if the id already exists in list, make sure it's active, but keep the same place
		var index = state.findIndex(slot => slot.get('id') === action.entity.id);
		if (index !== -1){
			return state.set(index, makeSlot(action.entity, true))
		}
		//if this is an out of order update, we may need move a aggregator down from
		//where this one would have gone if it came in order, possibly repeating the process
		for (var i=0;i<state.size+1;i++){
			if (state.has(i) && state.get(i).get('createdTime') > action.entity.createdTime){
				let recursiveAction = { 
					type : ADD_AGGREGATORS,
					entity : {
						createdTime : state.get(i).get('createdTime'),
						id : state.get(i).get('id')
					}
				}
				return aggregatorListSlots(state.set(i, makeSlot(action.entity, true), recursiveAction))
			}

			//if we've run out of slots or this slot is inactive, set it
			if (!state.has(i) || !state.get(i).get('active')){
				return state.set(i, makeSlot(action.entity, true))
			}
		}
	case UPDATE_AGGREGATORS:
		if (action.mutations && action.mutations.find(mutation => mutation.value === 'removed')){
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

function makeSlot(aggregator, isActive){
	return Map({
		id : aggregator.id,
		createdTime : aggregator.createdTime,
		active : isActive,
		objectType : aggregator.objectType,
		objectId : aggregator.objectId
	})
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

	var newList = state.setIn([index, 'active'], false);

	var lastFilledSlotIndex = findLastFilledSlot(newList);
	if (lastFilledSlotIndex !== false){
		return newList.slice(0, lastFilledSlotIndex+1)
	}
	return List()
}