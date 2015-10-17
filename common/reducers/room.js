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
	default:
		return state;
	}
}