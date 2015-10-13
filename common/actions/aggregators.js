import * as types from '../constants/ActionTypes'
import { createAggregator } from '../models/aggregator'

export function selectDeselectAggregator(id){
	return function(dispatch, getState){
		const aggregators = getState().aggregators.get('present').filter(a => a.get('state') === 'initializing' || a.get('state') === 'aggregating');
		const specificAggregator = aggregators.find(a => a.get('id') === id);
		if (!specificAggregator) return;
		if (specificAggregator.get('isPressing') === true){
			dispatch({
				type : types.UPDATE_AGGREGATOR_SELECT_DESELECT,
				id : id,
				isSelected : false
			});
		} else {
			//should only ever be one, but just in case, get a list
			const selectedAggregators = aggregators.filter(a => a.get('isPressing') === true);
			selectedAggregators.forEach(aggregatorToClear => {
				dispatch({
					type : types.UPDATE_AGGREGATOR_SELECT_DESELECT,
					id : aggregatorToClear.get('id'),
					isSelected : false
				});
			});
			dispatch({
				type : types.UPDATE_AGGREGATOR_SELECT_DESELECT,
				id,
				isSelected : true
			});
		}
	}
}

export function newAggregator(objectType, objectId){
	return function(dispatch, getState){
		var userName = getState().user.userName;
		var object = getState().chatMessages.get('present').find(cm => cm.get('id') === objectId);
		if (!object || object.get('userName') === userName) return;
		var aggregator = createAggregator({
		objectId,
		objectType,
		userName,
		objectUserName : object.get('userName')
		});
		dispatch({
			type : types.ADD_AGGREGATORS,
			entity : aggregator
		})
		selectDeselectAggregator(aggregator.id)(dispatch, getState)
	}
}