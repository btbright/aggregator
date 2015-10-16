import * as types from '../constants/ActionTypes'
import * as notificationActions from './notifications'
import constants from '../constants/App'

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

export function updateFilerLevel(filterLevel){
	return {
		type : types.UPDATE_FILTER_LEVEL,
		filterLevel
	}
}

export function updateUserPoints(userName, points, newPoints){
	return function(dispatch, getState){

		dispatch({
			type : types.UPDATE_USER_POINTS,
			userName,
			points,
			isRemoteTriggered : true
		})

		if (getState().user.userName !== userName) return;

		const cornyIndex = Math.floor(Math.random()*constants.Points.Notifications.SAYINGS.length)
		const endingIndex = Math.floor(Math.random()*constants.Points.Notifications.ENDINGS.length)

		dispatch(notificationActions.addNotification(`${constants.Points.Notifications.SAYINGS[cornyIndex]}, you got ${newPoints} points for doing something clever. ${constants.Points.Notifications.ENDINGS[endingIndex]}`, "informational"))
	}
}