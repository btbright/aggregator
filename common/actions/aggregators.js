import * as types from '../constants/ActionTypes'
import { createAggregator } from '../models/aggregator'
import { submitAggregator, submitAggregatorClick } from '../apiutils/aggregators'

export function updateAggregatorToTime(id, time){
	return {
		type : types.UPDATE_AGGREGATOR_TO_TIME,
		id,
		time
	}
}

export function updateAggregatorToNow(id){
	return {
		type : types.UPDATE_AGGREGATOR_TO_TIME,
		id,
		time : Date.now()
	}
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