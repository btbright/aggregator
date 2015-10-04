import { ADD_CHAT_MESSAGE, VOTE_CHAT_MESSAGE, UPDATE_CHAT_MESSAGE_ID } from '../constants/ActionTypes';
import { newListWithReplacementFields } from '../utils/reducerTools'

const initialState = [];

export default function chatMessages(state = initialState, action) {
	switch (action.type) {
	case ADD_CHAT_MESSAGE:
		return [...state,action.message]
	case VOTE_CHAT_MESSAGE:
		return newListWithReplacementFields(state, action.id, (oldMessage) => ({ hasUserVoted: !oldMessage.hasUserVoted }));
	default:
    	return state;
  	}
}