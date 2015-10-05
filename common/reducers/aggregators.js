import { REMOVE_AGGREGATOR, RETIRE_AGGREGATOR, UPDATE_AGGREGATOR_TO_TIME, UPDATE_AGGREGATORS, ADD_AGGREGATOR, ADD_CLICK_TO_AGGREGATOR, UPDATE_AGGREGATOR_ID } from '../constants/ActionTypes';
import { scorer } from '../utils/scorer'
import { newListWithReplacementFromSubreducer, newListWithReplacementFields } from '../utils/reducerTools'
import constants from '../constants/App'


const initialState = [];

export default function aggregators(state = initialState, action) {
	switch (action.type) {
	case ADD_AGGREGATOR:
		//if an aggregator already exists for the object, don't add it
		if (state.some((aggregator) => aggregator.objectId === action.aggregator.objectId)) return state;
		return [action.aggregator,...state]
	//set calculated aggregator state to time based on click history
	case UPDATE_AGGREGATOR_TO_TIME:
		return newListWithReplacementFromSubreducer(state, action, aggregator);
	case UPDATE_AGGREGATORS:

		var newList = [...state];
		action.updatedAggregators.forEach(updatedAggregator => {
			var index = state.findIndex(a => a.id === updatedAggregator.id);
			newList = [
			  ...newList.slice(0, index),
			  Object.assign({},state[index],updatedAggregator),
			  ...newList.slice(index + 1)
			]
		});
		return newList;

	case ADD_CLICK_TO_AGGREGATOR:
		return newListWithReplacementFromSubreducer(state, action, aggregator);
	case RETIRE_AGGREGATOR:
		return newListWithReplacementFromSubreducer(state, action, aggregator);
	case REMOVE_AGGREGATOR:
		return newListWithReplacementFromSubreducer(state, action, aggregator);
	default:
    	return state;
  	}
}

function aggregator(state, action){
	switch(action.type){
	case UPDATE_AGGREGATOR_TO_TIME:
		var scoreResults = scorer(state.clicks, action.time, state.x, state.velocity);
		return Object.assign({},state,{
			x : scoreResults.x,
			velocity : scoreResults.velocity,
			maxValue : state.maxValue >= scoreResults.x ? state.maxValue : scoreResults.x,
			isComplete : scoreResults.x === 100 || (scoreResults.x === 0 && state.maxValue != 0)
		});
	case ADD_CLICK_TO_AGGREGATOR:
		return Object.assign({},state,{
			clicks : [...state.clicks, action.click]
		});
	case RETIRE_AGGREGATOR:
		return Object.assign({},state,{
			isRetired : true
		});
	case REMOVE_AGGREGATOR:
		return Object.assign({},state,{
			isRemoved : true
		});
	default:
		return state;
	}
}