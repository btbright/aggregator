import { RETIRE_AGGREGATOR, UPDATE_AGGREGATOR_TO_TIME, ADD_AGGREGATOR, ADD_CLICK_TO_AGGREGATOR, UPDATE_AGGREGATOR_ID } from '../constants/ActionTypes';
import scorer from '../utils/scorer'
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
	case ADD_CLICK_TO_AGGREGATOR:
		return newListWithReplacementFromSubreducer(state, action, aggregator);
	case UPDATE_AGGREGATOR_ID:
		return newListWithReplacementFromSubreducer(state, action, aggregator, "originalId");
	case RETIRE_AGGREGATOR:
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
		if (!shouldAddClick(state.clicks,action.click)) return state;
		return Object.assign({},state,{
			clicks : [...state.clicks, action.click]
		});
	case UPDATE_AGGREGATOR_ID:
		return Object.assign({},state,{
			id : action.newId
		});
	case RETIRE_AGGREGATOR:
		return Object.assign({},state,{
			isRetired : true
		});
	default:
		return state;
	}
}

//rate limit clicks to prevent scripting massive clickrates
function shouldAddClick(clicks, click){
	if (clicks.length === 0) return true;
	return click - clicks[clicks.length-1] > constants.Aggregator.CLICKTHRESHOLD;
}