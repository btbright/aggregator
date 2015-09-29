import { UPDATE_AGGREGATOR_TO_TIME, ADD_AGGREGATOR, ADD_CLICK_TO_AGGREGATOR } from '../constants/ActionTypes';
import scorer from '../utils/scorer'

const initialState = [];

export default function aggregators(state = initialState, action) {
	switch (action.type) {
	case ADD_AGGREGATOR:
		//if an aggregator already exists for the object, don't add it
		if (state.some((aggregator) => aggregator.objectId === action.objectId)) return state;
		return [{
		  id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
		  createdTime: action.createdTime,
		  userName : action.user,
		  objectType : action.objectType,
		  objectId : action.objectId,
		  clicks : [action.createdTime],
		  maxValue : 0,
		  x : 0,
		  isComplete : false
		},...state]
	//set calculated aggregator state to time based on click history
	case UPDATE_AGGREGATOR_TO_TIME:
		var index = state.findIndex(m => m.id == action.id);
		if (index === -1) return state;
		return [
		  ...state.slice(0, index),
		  aggregator(state[index],{
		  	type : UPDATE_AGGREGATOR_TO_TIME,
		  	time : action.time
		  }),
		  ...state.slice(index + 1)
		]
	case ADD_CLICK_TO_AGGREGATOR:
		var index = state.findIndex(m => m.id == action.id);
		if (index === -1) return state;
		return [
		  ...state.slice(0, index),
		  aggregator(state[index],{
		  	type : ADD_CLICK_TO_AGGREGATOR,
		  	click : action.click
		  }),
		  ...state.slice(index + 1)
		]
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
	default:
		return state;
	}
}