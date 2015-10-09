import * as types from '../constants/ActionTypes'
import { submitMessage } from '../apiutils/chat'
import { createChatMessage } from '../models/chatMessage'

export function addChatMessage(message){
	return {
		type : types.ADD_CHATMESSAGES,
		entity : message
	}
}