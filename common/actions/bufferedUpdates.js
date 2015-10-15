import { ADD_UPDATES, MOVE_TO_TIME } from '../constants/ActionTypes'
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

	let actions = [];
	Object.keys(updates).forEach(updatedNamespace => {
		Object.keys(updates[updatedNamespace]).forEach(time => {
			let wasMissed = false;
			let latency = (Date.now()-parseInt(time,10)); //this wont always be the latency, but it is right now
			if (latency > constants.App.BUFFERTIME){
				wasMissed = true;
			}
			let action = {
				type : `ADD_${updatedNamespace.toUpperCase()}_UPDATES`,
				time : parseInt(time,10),
				updates : updates[updatedNamespace][time],
				wasMissed
			};
			actions.push(action);
		});
	});
	return actions;
}

export function moveToTime(time, isUtilityMove = false, fromTime = undefined){
	return {
		type : MOVE_TO_TIME,
		time,
		isUtilityMove,
		fromTime
	}
}