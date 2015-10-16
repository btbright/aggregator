import * as types from '../constants/ActionTypes'
import { createNotification } from '../models/notification'
import constants from '../constants/App'

export function addNotification(text, type){
	return {
		type : types.ADD_NOTIFICATION,
		notification : createNotification({text, type, timeToShow : constants.Notifications.TIMETOSHOW}),
	}
}

export function currentNotificationComplete(timeComplete){
	return {
		type : types.CURRENT_NOTIFICATION_COMPLETE,
		timeComplete
	}
}