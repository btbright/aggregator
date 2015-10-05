import { ADD_NOTIFICATION, CURRENT_NOTIFICATION_COMPLETE } from '../constants/ActionTypes';

const intitialState = {
	current : null,
	pending : []
};

export default function notifications(state = intitialState, action){
	switch (action.type) {
	case ADD_NOTIFICATION:
		//if there isn't a current notification or it has expired
		if (!state.current || (action.notification.createdTime - state.current.timeMadeCurrent) >= (state.current.timeToShow)){
			return Object.assign({}, state, { current : Object.assign({}, action.notification, { timeMadeCurrent : action.notification.createdTime }) });
		} else {
			return Object.assign({}, state, { pending : [...state.pending, action.notification] });
		}
	case CURRENT_NOTIFICATION_COMPLETE:
		if (!state.current) return;
		if (state.pending.length === 0) {
			return intitialState;
		}
		return Object.assign({},state, { current: Object.assign({}, state.pending[0], { timeMadeCurrent : action.timeComplete }), pending: [...state.pending.slice(1)] });
	default:
		return state;
	}
}