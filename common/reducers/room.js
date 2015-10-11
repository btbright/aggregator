import { UPDATE_USER_COUNT, UPDATE_ACTIVE_CLICKER_COUNT } from '../constants/ActionTypes';

const initialState = {
	name : "",
	userCount : 0,
	activeClickerCount : 0
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
	default:
		return state;
	}
}