import * as types from '../constants/ActionTypes';

export function newChatMessage(text){
	return {
		type : types.ADD_CHAT_MESSAGE,
		text,
		user : "ben",
		time : Date.now()
	}
}

export function voteChatMessage(id){
	return {
		type : types.VOTE_CHAT_MESSAGE,
		id : id
	}
}
