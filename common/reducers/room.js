import { UPDATE_USER_COUNT, UPDATE_ACTIVE_CLICKER_COUNT, UPDATE_TWITCH_VIEWER_COUNT } from '../constants/ActionTypes';

const initialState = {
	name : "",
	userCount : 0,
	activeClickerCount : 0,
	twitch : false,
	twitchChannel : '',
	twitchChannelViewerCount : false
}

export default function room(state = initialState, action) {
	switch (action.type) {
	case UPDATE_USER_COUNT:
		return Object.assign({},state,{
			userCount : action.userCount
		});
	case UPDATE_ACTIVE_CLICKER_COUNT:
		return Object.assign({},state,{
			activeClickerCount : action.activeClickerCount
		});
	case UPDATE_TWITCH_VIEWER_COUNT:
		return Object.assign({},state,{
			twitchChannelViewerCount : action.viewerCount
		});
	case 'SOCKET_RECEIVED':
		//super naive guess - UTF-16 ~2 bytes per character + socket overhead
		const newBytes = state.totalBytes + (JSON.stringify(action.data).length * 2)
		console.log(newBytes / ((Date.now() - state.startTime)/1000))
		return Object.assign({},state,{
			totalBytes : newBytes
		});
	default:
		return state;
	}
}