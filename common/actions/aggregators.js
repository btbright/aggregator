import * as types from '../constants/ActionTypes'
import { createAggregator, decodeUpdate, statesLookup, typesLookup } from '../models/aggregator'

export function selectDeselectAggregator(id, objectId, objectType){
	return function(dispatch, getState){
		const pressingAggregatorId = getState().user.pressedAggregatorId;
		const pressingObjectId = getState().user.pressedObjectId;
		if (id && !objectId){
			const aggregator = getState().aggregators.get('present').find(a => a.get('id') === id);
			console.log(aggregator)
			if (aggregator){
				objectId = aggregator.get('objectId');
				objectType = aggregator.get('objectType');
			}
		}
		dispatch({
			type : types.UPDATE_AGGREGATOR_SELECT_DESELECT,
			isSelected : pressingAggregatorId !== id || (pressingObjectId && objectId) && pressingObjectId !== objectId,
			id,
			objectId,
			objectType
		});
	}
}

export function nominateAggregator(objectType, objectId, aggregatorId){
	return function(dispatch, getState){
		var userName = getState().user.userName;
		var object = getState().chatMessages.get('present').find(cm => cm.get('id') === objectId);
		if (objectType === 'message'){
			if (!object || object.get('userName') === userName) return;
		}
		var aggregator = createAggregator({
			createdTime : getState().time.get('currentTime'),
			objectId,
			objectType,
			userName,
			objectUserName : object ? object.get('userName') : ''
		});
		dispatch({
			type : types.NOMINATE_AGGREGATORS,
			entity : aggregator,
			key : aggregator.id,
			keyField : 'id'
		})
	}
}

export function handlePackedUpdates(time, rawUpdates){
	return function(dispatch, getState){
		let actions = [];
		const updates = decodeUpdate(rawUpdates);
		updates.forEach(update => {
			let action;
			//if it's a permagator and hasn't been added, we can recreate from the update... how fancy
			if (parseInt(update.type, 10) === 1 && !getState().aggregators.get('present').has(update.id)){
				update.mutations.objectType = 'permagator';
				update.mutations.id = update.id;
				update.mutations.objectId = update.objectId;
				update.mutations.state = statesLookup[update.mutations.state]
				action = {
					type : types.ADD_AGGREGATORS,
					isUpdateAction : true,
					isRemoteTriggered : true,
					time,
					key : update.id,
					keyField : 'id',
					entity : update.mutations
				}
			} else {
				action = {
					type : types.UPDATE_AGGREGATORS,
					isUpdateAction : true,
					isRemoteTriggered : true,
					time,
					key : update.id,
					objectId : update.objectId,
					objectType : typesLookup[update.type],
					keyField : 'id',
					mutations : buildMutations(update.mutations)
				}
			}
			actions.push(action)
		});
		return actions;
	}
}

function buildMutations(mutations){
	return Object.keys(mutations).map(property => {

		if (property === 'state'){
			return { property, value : statesLookup[mutations[property]]}
		}

		return { property, value : mutations[property] }
	})
}