import { bindActionCreators } from 'redux'
import * as RoomActions from '../actions/room'
import * as UserActions from '../actions/user'
import * as NotificationActions from '../actions/notifications'

export function bindRoomListeners(dispatch){
	if (typeof io === "undefined") return; //only bind listeners on client (better way to do this?)
	var actions = bindActionCreators(RoomActions, dispatch);
	var userActions = bindActionCreators(UserActions, dispatch);
	var notificationActions = bindActionCreators(NotificationActions, dispatch);
	var socket = io();
	socket.on('roomInfo:userCount:update', actions.updateUserCount);
	socket.on('error:user:name:change', function(error){
		userActions.removeUserName();
		notificationActions.addNotification(error, "error");
	});
}

export function requestNewRoom(newRoom, oldRoom){
	if (typeof io === "undefined") return; //only bind listeners on client (better way to do this?)
	io().emit("room:change",{newRoom, oldRoom});
}

export function requestNameChange(name){
	if (typeof io === "undefined") return; //only bind listeners on client (better way to do this?)
	io().emit("user:name:change", name);
}