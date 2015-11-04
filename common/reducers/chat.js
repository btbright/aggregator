import { Map } from 'immutable'
import { ADD_AGGREGATORS, UPDATE_AGGREGATORS, REMOVE_AGGREGATORS } from '../constants/ActionTypes'
 
const initialState = Map();
//main functionality handled in deltable
//all this aggregator coupling is for performance to save on joins at 60fps
//join on write, rather than read
export default function chatMessages(state = initialState, action) {
	switch (action.type) {
	case ADD_AGGREGATORS:
		if (action.entity.objectType === 'message'){
			const messageId = action.entity.objectId;
			const message = state.get(messageId);
			if (!message) return state;
			return state.set(messageId, state.get(messageId).withMutations(message => {
				message.set('hasAggregator', true);
				message.set('aggregationLevel', action.entity.level);
				message.set('isAggregationComplete', false);
				message.set('aggregatorId', action.key);
			}))
		}
		return state;
	case UPDATE_AGGREGATORS:
		var relevantMutations = action.mutations.filter(mutation => {
			return mutation.property === 'level' || mutation.property === 'state';
		});
		if (relevantMutations.length === 0) return state;

		const findResults = state.findEntry(obj => obj.get('aggregatorId') === action.key);
		if (!findResults) return state;

		const [key, entity] = findResults;	
		return state.set(key, state.get(key).withMutations(message => {
			relevantMutations.forEach(mutation => {
				if (mutation.property === 'level'){
					message.set('aggregationLevel', mutation.value);
				} else if (mutation.property === 'state' && mutation.value === 'completed'){
					message.set('isAggregationComplete', true);
				}
			});
		}))	
	case REMOVE_AGGREGATORS:
		const findResultsRemove = state.findEntry(obj => obj.get('aggregatorId') === action.key);
		if (!findResultsRemove) return state;
		const [removeKey, removeEntity] = findResultsRemove;	
		return state.set(removeKey, state.get(removeKey).withMutations(message => {
			message.set('hasAggregator', false);
			message.set('aggregationLevel', 0);
			message.set('isAggregationComplete', false);
			message.set('aggregatorId', '');
		}))

	default:
    	return state;
  	}
}