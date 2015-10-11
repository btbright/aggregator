import { List } from 'immutable'
import { ADD_AGGREGATORS, UPDATE_AGGREGATORS } from '../constants/ActionTypes'

const initialState = List();
//main functionality handled in deltable
export default function chatMessages(state = initialState, action) {
	switch (action.type) {
	case ADD_AGGREGATORS:
		if (action.entity.objectType === 'message'){
			const findResults = state.findEntry(obj => obj.get('id') === action.entity.objectId);
			if (!findResults) return state;
			const [index, entity] = findResults;
			return state.set(index, state.get(index).withMutations(message => {
				message.set('hasAggregator', true);
				message.set('aggregationLevel', action.entity.level);
				message.set('isAggregationComplete', false);
				message.set('aggregatorId', action.key);
			}))
		}
	case UPDATE_AGGREGATORS:
		const findResults = state.findEntry(obj => obj.get('aggregatorId') === action.key);
		if (!findResults) return state;

		var relevantMutations = action.mutations.filter(mutation => {
			return mutation.property === 'level' || mutation.property === 'state';
		});
		if (relevantMutations.length === 0) return state;

		const [index, entity] = findResults;	
		return state.set(index, state.get(index).withMutations(message => {
			relevantMutations.forEach(mutation => {
				if (mutation.property === 'level'){
					message.set('aggregationLevel', message.get('aggregationLevel') + mutation.value);
				} else if (mutation.property === 'state' && mutation.value === 'completed'){
					message.set('isAggregationComplete', true);
				}
			});
		}))	
	default:
    	return state;
  	}
}