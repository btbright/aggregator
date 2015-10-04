import * as types from '../constants/ActionTypes'
import { createAggregator } from '../models/aggregator'
import { submitAggregator, submitAggregatorClick } from '../apiutils/aggregators'
import { clicksPerMinSelector } from '../selectors/StatsSelectors.js'
import { scorer, generateScore, calculateVelocity, calculateClickrateMulitplier, activeClicks } from '../utils/scorer'
import constants from '../constants/App'
import Parallel from 'paralleljs'

export function retireAggregator(id){
	return {
		type : types.RETIRE_AGGREGATOR,
		id
	}
}

export function updateAggregatorToTime(id, time){
	return function(dispatch, getState){
		//var clicksPerMin = clicksPerMinSelector(getState())
		dispatch(makeUpdateAggregatorToTimeAction(id, time, 10));
	}
}

export function updateAggregatorsToTime(ids, time, frameRate){
	return function(dispatch, getState){
		var updatedAggregators = []
		var aggregators = getState().aggregators
		var activeClickerCount = getState().room.activeClickerCount
		ids.forEach(function(id){
			updatedAggregators.push(generateUpdatedAggregator(id, aggregators, time, frameRate, activeClickerCount))
		})
		dispatch(makeUpdateAggregatorsAction(updatedAggregators, time, 10))
		
	}
}

function generateUpdatedAggregator(id, state, time, frameRate, activeClickerCount){
	var index = state.findIndex(m => m.id === id);
	if (index === -1) return 0;
	var storedAggregator = state[index];
	var scoreResults = scorer(storedAggregator.clicks, time, frameRate, storedAggregator.x, storedAggregator.velocity, activeClickerCount);
	var isComplete = storedAggregator.isComplete || scoreResults.x === 100 || (scoreResults.x === 0 && storedAggregator.maxValue != 0);
	return Object.assign({},storedAggregator,{
		x : scoreResults.x,
		velocity : scoreResults.velocity,
		maxValue : storedAggregator.maxValue >= scoreResults.x ? storedAggregator.maxValue : scoreResults.x,
		isComplete : isComplete,
		completedTime : time
	});
}

export function makeUpdateAggregatorsAction(updatedAggregators){
	return {
		type : types.UPDATE_AGGREGATORS,
		updatedAggregators
	}
}

function makeUpdateAggregatorToTimeAction(id, time, clicksPerMin){
	return {
		type : types.UPDATE_AGGREGATOR_TO_TIME,
		id,
		time,
		clicksPerMin
	}
}

export function updateAggregatorToNow(id){
	return updateAggregatorToTime(id, Date.now());
}

export function updateAggregatorsToNow(ids, frameRate){
	return updateAggregatorsToTime(ids, Date.now(), frameRate);
}

export function newAggregatorClick(id){
	return function(dispatch, getState){
		var click = Date.now();
		var aggregators = getState().aggregators;
		var index = getState().aggregators.findIndex(a => a.id === id);
		var shouldAdd = shouldAddClick(aggregators[index].clicks,click)
		if (!shouldAdd) return
		submitAggregatorClick(id, click);	
		dispatch(addClickToAggregator(id, click))
	}
}

//rate limit clicks to prevent scripting massive clickrates
function shouldAddClick(clicks, click){
	if (clicks.length === 0) return true;
	return click - clicks[clicks.length-1] > constants.Aggregator.CLICKTHRESHOLD;
}

export function addClickToAggregator(id, click){
	return {
		type : types.ADD_CLICK_TO_AGGREGATOR,
		id,
		click
	}
}

export function updateAggregatorId(originalId, newId){
	return {
		type: types.UPDATE_AGGREGATOR_ID,
		originalId,
		newId
	}
}

export function addAggregator(aggregator){
	return {
		type : types.ADD_AGGREGATOR,
		aggregator : aggregator
	}
}

export function newAggregator(objectType, objectId){
	return function(dispatch, getState){
		var userName = getState().user.userName;
		var aggregator = createAggregator({
		objectId,
		objectType,
		user : userName
		});
		submitAggregator(aggregator);
		dispatch({
			type : types.ADD_AGGREGATOR,
			aggregator : aggregator
		})
	}
}