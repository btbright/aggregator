import { bindActionCreators } from 'redux'
import * as ChatActions from '../actions/chat'

export function bindChatListeners(dispatch){
	var actions = bindActionCreators(ChatActions, dispatch);
	var socket = io();
	socket.on('chatMessage:accepted', actions.updateChatMessageId);
	socket.on('chatMessage:new', actions.addChatMessage);
}

export function submitMessage(message){
	io().emit('chatMessage:new',message);
}