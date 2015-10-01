import * as types from '../constants/ActionTypes'

export function updateUserName(userName){
	return {
		type: types.UPDATE_USER_NAME,
		userName
	}
}