import { UPDATE_USER_NAME } from '../constants/ActionTypes';

const initialState = {
	userName : ""
}

export default function user(state = initialState, action) {
	switch (action.type) {
	case UPDATE_USER_NAME:
		return Object.assign({},state,{
			userName : action.userName
		});
	default:
		return state;
	}
}