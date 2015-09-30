import { bindActionCreators } from 'redux'
import * as RoomActions from '../actions/room'

export function bindRoomListeners(dispatch){
	if (typeof io === "undefined") return; //only bind listeners on client (better way to do this?)
	var actions = bindActionCreators(RoomActions, dispatch);
	var socket = io();
	socket.on('userCount:update', actions.updateUserCount);
}

export function requestNewRoom(newRoom, oldRoom){
	if (typeof io === "undefined") return; //only bind listeners on client (better way to do this?)
	io().emit("room:change",{newRoom, oldRoom});
}