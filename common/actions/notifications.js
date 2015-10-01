import * as types from '../constants/ActionTypes'
import { createNotification } from '../models/notification'

export function addNotification(text, type){
	return {
		type : types.ADD_NOTIFICATION,
		notification : createNotification({text, type, timeToShow : 3000})
	}
}

export function currentNotificationComplete(timeComplete){
	return {
		type : types.CURRENT_NOTIFICATION_COMPLETE,
		timeComplete
	}
}