import { ADD_CHAT_MESSAGE, VOTE_CHAT_MESSAGE } from '../constants/ActionTypes';

const initialState = [{
  displayText: 'not a real message',
  id : 1235,
  userName : "ben",
  formattedTime : "10:30pm",
  hasUserVoted : false
}];

export default function chatMessages(state = initialState, action) {
	switch (action.type) {
	case ADD_CHAT_MESSAGE:
		return [...state,{
		  id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
		  displayText: action.text,
		  userName : action.user,
		  formattedTime : new Date(action.time).toLocaleTimeString(),
		  hasUserVoted : false
		}]
	case VOTE_CHAT_MESSAGE:
		var index = state.findIndex(m => m.id == action.id);
		if (index === -1) return state;
		return [
		  ...state.slice(0, index),
		  Object.assign({}, state[index], {
		    hasUserVoted: !state[index].hasUserVoted
		  }),
		  ...state.slice(index + 1)
		]
	default:
    	return state;
  	}
}