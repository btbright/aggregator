import { UPDATE_USER_COUNT } from '../constants/ActionTypes';

const initialState = {
	name : "",
	userCount : 0
}

export default function room(state = initialState, action) {
	switch (action.type) {
	case UPDATE_USER_COUNT:
		return Object.assign({},state,{
			userCount : action.userCount
		});
	default:
		return state;
	}
}

function determineAverage(){
	return 0
}