import { List } from 'immutable'
import { UPDATE_AGGREGATORS_PRESSING } from '../constants/ActionTypes'

const initialState = List();
//main functionality handled in deltable
export default function aggregators(state = initialState, action) {
	switch (action.type) {
	case UPDATE_AGGREGATORS_PRESSING:
		const findResults = state.findEntry(obj => obj.get('id') === action.aggregatorId);
		if (!findResults) return state;
		const [index, aggregator] = findResults;
		return state.set(index, aggregator.set('isPressing',action.isPressing))
	default:
    	return state;
  	}
}