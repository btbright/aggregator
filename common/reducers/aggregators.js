import { UPDATE_AGGREGATOR_TO_TIME, ADD_AGGREGATOR, ADD_CLICK_TO_AGGREGATOR, UPDATE_AGGREGATOR_ID } from '../constants/ActionTypes';
import scorer from '../utils/scorer'
import { newListWithReplacementFromSubreducer } from '../utils/reducerTools'

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
	default:
    	return state;
  	}
}

function aggregator(state, action){
	switch(action.type){
	case UPDATE_AGGREGATOR_TO_TIME:
		var newScore = scorer(state.clicks, action.time);
		return Object.assign({},state,{
			x : newScore,
			maxValue : state.maxValue >= newScore ? state.maxValue : newScore,
			isComplete : newScore === 100 || (newScore === 0 && state.maxValue != 0)
		});
	case ADD_CLICK_TO_AGGREGATOR:
		return Object.assign({},state,{
			clicks : [...state.clicks, action.click]
		});
	case UPDATE_AGGREGATOR_ID:
		return Object.assign({},state,{
			id : action.newId
		});
	default:
		return state;
	}
}