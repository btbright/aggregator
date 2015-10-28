import { ADD_UPDATES, MOVE_TO_TIME, TRIGGER_TIME_CORRECTION, CORRECT_TIME } from '../constants/ActionTypes'
import constants from '../constants/App'

//translates server updates into action structure
export function handleServerUpdate(updates){
	/*
	from server like this
	const updates = {
		chatMessages : {
			3253461346 : [updates]
		}
	}
	*/
	return function(dispatch, getState){
		let actions = [];
		Object.keys(updates).forEach(updatedNamespace => {
			Object.keys(updates[updatedNamespace]).forEach(time => {
				actions = actions.concat(...updates[updatedNamespace][time]);
			});
		});
		const chatMessages = getState().chatMessages.get('present');
		actions.forEach(action => {
			if (action.type === "ADD_AGGREGATORS"){
				//check that this client has the chatmessage
				let chatMessage = chatMessages.find(chat => chat.get('id') === action.entity.objectId);
				if (chatMessage){
					dispatch(action)
				}
			} else {
				dispatch(action);
			}
		});
	}
}