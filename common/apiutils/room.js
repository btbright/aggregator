import { bindActionCreators } from 'redux'
import * as RoomActions from '../actions/room'

export function bindRoomListeners(dispatch){
	var actions = bindActionCreators(RoomActions, dispatch);
	var socket = io();
	socket.on('userCount:update', actions.updateUserCount);
}

export function requestNewRoom(newRoom, oldRoom){
	io().emit("room:change",{newRoom, oldRoom});
}