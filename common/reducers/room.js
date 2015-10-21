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
		const newBytes = state.totalBytes + getUTF8Size(JSON.stringify(action.data))
		//console.log(newBytes / ((Date.now() - state.startTime)/1000))
		return Object.assign({},state,{
			totalBytes : newBytes
		});
	default:
		return state;
	}
}

var getUTF8Size = function( str ) {
  var sizeInBytes = str.split('')
    .map(function( ch ) {
      return ch.charCodeAt(0);
    }).map(function( uchar ) {
      // The reason for this is explained later in
      // the section “An Aside on Text Encodings”
      return uchar < 128 ? 1 : 2;
    }).reduce(function( curr, next ) {
      return curr + next;
    });

  return sizeInBytes;
};