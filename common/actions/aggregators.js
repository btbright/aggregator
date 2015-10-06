import * as types from '../constants/ActionTypes'
import { createAggregator } from '../models/aggregator'
import { submitAggregator, submitAggregatorClick } from '../apiutils/aggregators'
import { clicksPerMinSelector } from '../selectors/StatsSelectors.js'
import { scorer, generateScore, calculateVelocity, calculateClickrateMulitplier, activeClicks } from '../utils/scorer'
import constants from '../constants/App'

export function retireAggregator(id){
	return {
		type : types.RETIRE_AGGREGATOR,
		id
	}
}

export function removeAggregator(id){
	return {
		type : types.REMOVE_AGGREGATOR,
		id
	}
}

export function updateAggregatorToTime(id, time){
	return function(dispatch, getState){
		//var clicksPerMin = clicksPerMinSelector(getState())
		dispatch(makeUpdateAggregatorToTimeAction(id, time, 10));
	}
}

export function updateAggregatorsToTime(aggregators, time, frameRate, activeClickerCount){
	return function(dispatch, getState){
		var updatedAggregators = []
		aggregators.forEach(function(aggregator){
			updatedAggregators.push(generateUpdatedAggregator(aggregator, time, frameRate, activeClickerCount))
		})
		dispatch(makeUpdateAggregatorsAction(updatedAggregators, time, 10))
	}
}

function generateUpdatedAggregator(storedAggregator, time, frameRate, activeClickerCount){
	var scoreResults = scorer(storedAggregator.clicks, time, frameRate, storedAggregator.barValue, storedAggregator.velocity, activeClickerCount);
	var isComplete = storedAggregator.isComplete || scoreResults.x === 100 || (scoreResults.x === 0 && storedAggregator.maxValue != 0);
	return Object.assign({},storedAggregator,{
		x : scoreResults.x,
		velocity : scoreResults.velocity,
		maxValue : storedAggregator.residueValue >= scoreResults.x ? storedAggregator.residueValue : scoreResults.x,
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

export function updateAggregatorsToNow(ids, frameRate, activeClickerCount){
	return updateAggregatorsToTime(ids, Date.now(), frameRate, activeClickerCount);
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

export function addAggregator(aggregator){
	return function(dispatch, getState){
		var aggregatorBaseObject = false;
		if (aggregator.objectType === 'message'){
			aggregatorBaseObject = getState().chatMessages.find(m => m.id === aggregator.objectId);
		}
		if (!aggregatorBaseObject) return;
		dispatch({
			type : types.ADD_AGGREGATOR,
			aggregator : aggregator
		})
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