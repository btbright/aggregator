import { addNotification } from '../actions/notifications'
import { ADD_AGGREGATORS, UPDATE_AGGREGATOR_SELECT_DESELECT } from '../constants/ActionTypes'

export default {
	remoteToLocalMap : {
		'reconnecting' : () => {
			return addNotification('The connection to the server has been lost. Attempting to reconnect...', 'warning');
		},
		'reconnect' : () => {
			return addNotification('Reconnected to the server', 'informative');
		},
		'reconnect_error' : () => {
			return addNotification('Error reconnecting', 'error');
		},
		'reconnect_failed' : () => {
			return addNotification('Attempts to reconnect to the server have failed. It has probably crashed.', 'error');
		}
	},
	localToRemoteMap : {}
}