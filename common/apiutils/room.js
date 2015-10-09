import * as actions from '../actions/room'
import * as userActions from '../actions/user'
import * as notificationActions from '../actions/notifications'
import { UPDATE_ROOM, UPDATE_USER_NAME } from '../constants/ActionTypes'

export default {
	remoteToLocalMap : {
		'room:userCount:update' : actions.updateUserCount,
		'room:activeClickers:update' : actions.updateActiveClickerCount,
		'error:user:name:change' : function(error) {
			return [
				userActions.removeUserName(), 
				notificationActions.addNotification(error, "error")
				]
		}
	},
	localToRemoteMap : {
		[UPDATE_ROOM] : (action) => ({ event : 'room:change', data : [{ newRoom : action.newRoom, oldRoom : action.oldRoom }]}),
		[UPDATE_USER_NAME] : (action) => ({ event : 'user:name:change', data : [action.userName]}),
	}
}