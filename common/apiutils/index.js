import { bindChatListeners } from './chat'
import { bindRoomListeners } from './room'
import { bindAggregatorListeners } from './aggregators'

export default function bindListeners(dispatch){
	bindChatListeners(dispatch);
	bindRoomListeners(dispatch);
	bindAggregatorListeners(dispatch);
}