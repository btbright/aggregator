import { ADD_CHAT_MESSAGE, VOTE_CHAT_MESSAGE, UPDATE_CHAT_MESSAGE_ID } from '../constants/ActionTypes';

const initialState = [];

export default function chatMessages(state = initialState, action) {
	switch (action.type) {
	case ADD_CHAT_MESSAGE:
		return [...state,action.message]
	case VOTE_CHAT_MESSAGE:
		var index = state.findIndex(m => m.id === action.id);
		if (index === -1) return state;
		return [
		  ...state.slice(0, index),
		  Object.assign({}, state[index], {
		    hasUserVoted: !state[index].hasUserVoted
		  }),
		  ...state.slice(index + 1)
		]
	case UPDATE_CHAT_MESSAGE_ID:
		var index = state.findIndex(m => m.id === action.originalId);
		if (index === -1) return state;
		return [
		  ...state.slice(0, index),
		  Object.assign({}, state[index], {
		    id: action.newId
		  }),
		  ...state.slice(index + 1)
		]
	default:
    	return state;
  	}
}