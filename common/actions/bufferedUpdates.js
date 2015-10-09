import { ADD_UPDATES, MOVE_TO_TIME } from '../constants/ActionTypes'

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
	let actions = [];
	Object.keys(updates).forEach(updatedNamespace => {
		Object.keys(updates[updatedNamespace]).forEach(time => {
			let action = {
				type : `ADD_${updatedNamespace.toUpperCase()}_UPDATES`,
				time : parseInt(time,10),
				updates: updates[updatedNamespace][time]
			};
			actions.push(action);
		});
	});
	return actions;
}

export function moveToTime(time){
	return {
		type : MOVE_TO_TIME,
		time
	}
}