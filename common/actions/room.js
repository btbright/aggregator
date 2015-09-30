import * as types from '../constants/ActionTypes'
import { requestNewRoom } from '../apiutils/room'

export function updateUserCount(userCount){
	return {
		type: types.UPDATE_USER_COUNT,
		userCount : userCount
	}
}

export function requestUpdateRoom(newRoom){
	requestNewRoom(newRoom);
	return {
		type: types.UPDATE_ROOM,
		newRoom
	}
}