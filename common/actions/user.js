import * as types from '../constants/ActionTypes'
import { requestNameChange } from '../apiutils/room'

export function updateUserName(userName){
	requestNameChange(userName)
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