import * as actions from '../actions/bufferedUpdates'

export default {
	remoteToLocalMap : {
		'update:new' : actions.handleServerUpdate
	},
	localToRemoteMap : {}
}