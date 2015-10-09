import * as types from '../constants/ActionTypes'

export function updateUserCount(userCount){
	return {
		type: types.UPDATE_USER_COUNT,
		userCount : userCount
	}
}

export function updateActiveClickerCount(activeClickerCount){
	return {
		type: types.UPDATE_ACTIVE_CLICKER_COUNT,
		activeClickerCount
	}
}

export function requestUpdateRoom(newRoom){
	return {
		type: types.UPDATE_ROOM,
		newRoom
	}
}