import * as types from '../constants/ActionTypes'
import { createAggregator, decodeUpdate, statesLookup } from '../models/aggregator'

export function selectDeselectAggregator(id){
	return function(dispatch, getState){
		dispatch({
			type : types.UPDATE_AGGREGATOR_SELECT_DESELECT,
			id : id,
			isSelected : getState().user.pressedAggregatorId !== id
		});
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
			entity : aggregator,
			time : getState().time.get('currentTime')
		})
		selectDeselectAggregator(aggregator.id)(dispatch, getState)
	}
}

//when the server didn't add the aggregator, we should remove it
export function addAggregatorError(requestedAggregatorId){
	return {
		type : types.REMOVE_AGGREGATORS,
		key : requestedAggregatorId,
		keyField : 'id'
	}
}

export function handlePackedUpdates(time, rawUpdates){
	let actions = [];
	const updates = decodeUpdate(rawUpdates);
	updates.forEach(update => {
		let action = {
			type : types.UPDATE_AGGREGATORS,
			isUpdateAction : true,
			isRemoteTriggered : true,
			time,
			key : update.id,
			keyField : 'id',
			mutations : buildMutations(update.mutations)
		}
		actions.push(action)
	});
	return actions;
}

function buildMutations(mutations){
	return Object.keys(mutations).map(property => {

		if (property === 'state'){
			return { property, value : statesLookup[mutations[property]]}
		}

		return { property, value : mutations[property] }
	})
}