import * as actions from '../actions/chat'
import { ADD_CHATMESSAGES } from '../constants/ActionTypes'

export default {
	remoteToLocalMap : {},
	localToRemoteMap : {
		[ADD_CHATMESSAGES] : (action) => ({ event : 'chatMessage:new', data : [action.entity]})
	}
}