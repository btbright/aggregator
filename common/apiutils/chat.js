import { bindActionCreators } from 'redux'
import * as ChatActions from '../actions/chat'

export function bindChatListeners(dispatch){
	if (typeof io === "undefined") return; //only bind listeners on client (better way to do this?)
	var actions = bindActionCreators(ChatActions, dispatch);
	var socket = io();
	socket.on('chatMessage:accepted', actions.updateChatMessageId);
	socket.on('chatMessage:new', actions.addChatMessage);
}

export function submitMessage(message){
	if (typeof io === "undefined") return; //only bind listeners on client (better way to do this?)
	io().emit('chatMessage:new',message);
}