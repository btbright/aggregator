import * as actions from '../actions/bufferedUpdates'
import * as timeActions from '../actions/time'
import { TRIGGER_TIME_CORRECTION } from '../constants/ActionTypes'

export default {
	remoteToLocalMap : {
		'update:new' : actions.handleServerUpdate,
		'timeCorrection:pong' : timeActions.handleTimeCorrection
	},
	localToRemoteMap : {
		[TRIGGER_TIME_CORRECTION] : () => ({ event : 'timeCorrection:ping', data : [Date.now()]})
	}
}