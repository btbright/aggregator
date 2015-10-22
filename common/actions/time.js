import * as types from '../constants/ActionTypes'

export function moveToTime(time, isUtilityMove = false, fromTime = undefined){
	return {
		type : types.MOVE_TO_TIME,
		time,
		isUtilityMove,
		fromTime
	}
}

export function triggerTimeCorrection(){
	return {
		type : types.TRIGGER_TIME_CORRECTION
	}
}

export function handleTimeCorrection(originalClientTime, serverTime){
	return {
		type : types.CORRECT_TIME,
		originalClientTime,
		serverTime
	}
}

export function pauseTime(){
	return {
		type : types.PAUSE_TIME
	}
}

export function playTime(){
	return {
		type : types.PLAY_TIME
	}
}

export function reverseTime(){
	return {
		type : types.REVERSE_TIME
	}
}