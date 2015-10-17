import * as actions from '../actions/bufferedUpdates'
import { TRIGGER_TIME_CORRECTION } from '../constants/ActionTypes'

export default {
	remoteToLocalMap : {
		'update:new' : actions.handleServerUpdate,
		'timeCorrection:pong' : actions.handleTimeCorrection
	},
	localToRemoteMap : {
		[TRIGGER_TIME_CORRECTION] : () => ({ event : 'timeCorrection:ping', data : [Date.now()]})
	}
}