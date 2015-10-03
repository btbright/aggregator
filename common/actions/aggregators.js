import * as types from '../constants/ActionTypes'
import { createAggregator } from '../models/aggregator'
import { submitAggregator, submitAggregatorClick } from '../apiutils/aggregators'
import { clicksPerMinSelector } from '../selectors/StatsSelectors.js'
import { scorer, generateScore, calculateVelocity, calculateClickrateMulitplier, activeClicks } from '../utils/scorer'
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
		ids.forEach(function(id){
			updatedAggregators.push(generateUpdatedAggregator(id, getState().aggregators, time, frameRate))
		})
		dispatch(makeUpdateAggregatorsToTimeAction(updatedAggregators, time, 10))
		/*
		var workers = new Parallel(ids, {
			env: {
				state : getState().aggregators,
				time
			}
		});

		workers
			.require(scorer)
			.require(generateScore)
			.require(calculateVelocity)
			.require(calculateClickrateMulitplier)
			.require(activeClicks)
			.map(generateFunction)
			.then(updatedAggregators => {
				dispatch(makeUpdateAggregatorsToTimeAction(updatedAggregators, time, 10));
			});

*/
	}
}

function generateUpdatedAggregator(id, state, time, frameRate){
	var index = state.findIndex(m => m.id === id);
	if (index === -1) return 0;
	var storedAggregator = state[index];
	var scoreResults = scorer(storedAggregator.clicks, time, frameRate, storedAggregator.x, storedAggregator.velocity);
	var isComplete = scoreResults.x === 100 || (scoreResults.x === 0 && storedAggregator.maxValue != 0);
	return Object.assign({},storedAggregator,{
		x : scoreResults.x,
		velocity : scoreResults.velocity,
		maxValue : storedAggregator.maxValue >= scoreResults.x ? storedAggregator.maxValue : scoreResults.x,
		isComplete : isComplete,
		completedTime : time
	});
}

function generateFunction(){}
generateFunction.toString = function(){
	return `
	function(id){
				var index = global.env.state.findIndex(m => m.id === id);
				if (index === -1) return 0;
				var storedAggregator = global.env.state[index];
				var scoreResults = scorer(storedAggregator.clicks, global.env.time, storedAggregator.x, storedAggregator.velocity);
				console.log(scoreResults)
				return Object.assign({},storedAggregator,{
					x : scoreResults.x,
					velocity : scoreResults.velocity,
					maxValue : storedAggregator.maxValue >= scoreResults.x ? storedAggregator.maxValue : scoreResults.x,
					isComplete : scoreResults.x === 100 || (scoreResults.x === 0 && storedAggregator.maxValue != 0)
				});
			}
	`
}

function makeUpdateAggregatorsToTimeAction(updatedAggregators){
	return {
		type : types.UPDATE_AGGREGATORS_TO_TIME,
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
	var click = Date.now();
	submitAggregatorClick(id, click);
	return addClickToAggregator(id, click);
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
	var aggregator = createAggregator({
		objectId,
		objectType,
		user : "ben"
	});
	submitAggregator(aggregator);
	return {
		type : types.ADD_AGGREGATOR,
		aggregator : aggregator
	}
}