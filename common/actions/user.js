import * as types from '../constants/ActionTypes'

export function updateUserName(userName){
	return {
		type: types.UPDATE_USER_NAME,
		userName
	}
}

export function removeUserName(){
	return {
		type : types.REMOVE_USER_NAME
	}
}

export function updateUserPoints(userName, points){
	return {
		type : types.UPDATE_USER_POINTS,
		userName,
		points
	}
}