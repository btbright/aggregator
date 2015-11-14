import * as types from '../constants/ActionTypes'
import { submitMessage } from '../apiutils/chat'
import { createChatMessage } from '../models/chatMessage'
import { nominateAggregator } from './aggregators'

export function addChatMessage(message){
	return function(dispatch, getState){
		//if there is a permagator with this text, nominate/press it instead of making a new chat message
		const permagators = getState().room.permagators;
		if (permagators.map(p => p.text).includes(message.text)){
			nominateAggregator('permagator', permagators.find(p => p.text === message.text).id)(dispatch, getState);
			return;
		}
		dispatch({
			type : types.ADD_CHATMESSAGES,
			entity : message,
			key : message.id,
			keyField : 'id',
			time : getState().time.get('currentTime')
		})
	}
}