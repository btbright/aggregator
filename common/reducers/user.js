import { UPDATE_USER_NAME, REMOVE_USER_NAME, UPDATE_FILTER_LEVEL } from '../constants/ActionTypes';

const initialState = {
	userName : "",
	filterLevel : ""
}

export default function user(state = initialState, action) {
	switch (action.type) {
	case UPDATE_USER_NAME:
		return Object.assign({},state,{
			userName : action.userName
		});
	case REMOVE_USER_NAME:
		return Object.assign({},state,{
			userName : ""
		});
	case UPDATE_FILTER_LEVEL:
		return Object.assign({},state,{
			filterLevel : action.filterLevel
		});
	default:
		return state;
	}
}