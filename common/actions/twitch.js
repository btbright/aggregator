import * as types from '../constants/ActionTypes'

export function updateViewerCount(viewerCount){
	return {
		type: types.UPDATE_TWITCH_VIEWER_COUNT,
		viewerCount
	}
}