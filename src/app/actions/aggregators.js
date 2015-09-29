import * as types from '../constants/ActionTypes'

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

export function addClickToAggregator(id){
	return {
		type : types.ADD_CLICK_TO_AGGREGATOR,
		id,
		click : Date.now()
	}
}

export function addAggregator(objectType, objectId){
	return {
		type : types.ADD_AGGREGATOR,
		createdTime : Date.now(),
		objectType,
		objectId,
		user : "ben"
	}
}