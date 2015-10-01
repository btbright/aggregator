import * as types from '../constants/ActionTypes'
import { submitMessage } from '../apiutils/chat'
import { createChatMessage } from '../models/chatMessage'

export function updateChatMessageId(idInfo){
	return {
		type: types.UPDATE_CHAT_MESSAGE_ID,
		originalId : idInfo.originalId,
		newId : idInfo.newId
	}
}

export function addChatMessage(message){
	return {
		type : types.ADD_CHAT_MESSAGE,
		message : message
	}
}

export function newChatMessage(text, userName){
	var newMessage = createChatMessage({
		text,
		userName,
		time : Date.now()
	});
	submitMessage(newMessage);
	return {
		type : types.ADD_CHAT_MESSAGE,
		message : newMessage
	}
}

export function voteChatMessage(id){
	return {
		type : types.VOTE_CHAT_MESSAGE,
		id : id
	}
}
