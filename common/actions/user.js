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

		const descriptorIndex = Math.floor(Math.random()*constants.Points.Notifications.POINTDESCRIPTORS.length)
		let notificationText = `You got ${newPoints} ${constants.Points.Notifications.POINTDESCRIPTORS[descriptorIndex]} points for doing something clever.`;
		if (newPoints < 0){
			notificationText = `You lost ${newPoints} points for supporting something unpopular. At least they don't mean anything.`
		}
		dispatch(notificationActions.addNotification(notificationText, "informational"))
	}
}

export function removeUserPoints(userName){
	return {
		type : types.REMOVE_USER_POINTS,
		userName
	}
}