import * as types from '../constants/ActionTypes'
import { createAggregator } from '../models/aggregator'

export function updateIsPressing(id, isPressing){
	return {
		type : types.UPDATE_AGGREGATORS_PRESSING,
		aggregatorId : id,
		isPressing
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
		dispatch({
			type : types.ADD_AGGREGATORS,
			entity : aggregator
		})
	}
}