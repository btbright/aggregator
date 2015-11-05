import * as types from '../constants/ActionTypes'
import { createAggregator, decodeUpdate, statesLookup } from '../models/aggregator'

export function selectDeselectAggregator(id){
	return function(dispatch, getState){
		const currentPressedId = getState().user.pressedAggregatorId;

		//if currently pressing another aggregator, let the server know to deselect it
		if (currentPressedId !== ""){
			dispatch({
				type : types.UPDATE_AGGREGATOR_SELECT_DESELECT,
				id : currentPressedId,
				isSelected : false
			});			
		}

		dispatch({
			type : types.UPDATE_AGGREGATOR_SELECT_DESELECT,
			id : id,
			isSelected : currentPressedId !== id
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
		selectDeselectAggregator(aggregatorId ? aggregatorId : aggregator.id)(dispatch, getState)
	}
}

export function handlePackedUpdates(time, rawUpdates){
	return function(dispatch, getState){
		let actions = [];
		const updates = decodeUpdate(rawUpdates);
		updates.forEach(update => {
			console.log('update: ',update)
			let action;
			//if it's a permagator and hasn't been added, we can recreate from the update... how fancy
			if (parseInt(update.type, 10) === 1 && !getState().aggregators.get('present').has(update.id)){
				update.mutations.objectType = 'permagator';
				update.mutations.id = update.id;
				update.mutations.objectId = update.objectId;
				action = {
					type : types.ADD_AGGREGATORS,
					isUpdateAction : true,
					isRemoteTriggered : true,
					time,
					key : update.id,
					keyField : 'id',
					entity : update.mutations
				}
				console.log('fake add action: ',action)
			} else {
				action = {
					type : types.UPDATE_AGGREGATORS,
					isUpdateAction : true,
					isRemoteTriggered : true,
					time,
					key : update.id,
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