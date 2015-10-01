export function createNotification(props){
	return {
		createdTime: props.createdTime || Date.now(),
		text : props.text,
		type : props.type,
		timeToShow : props.timeToShow,
		timeMadeCurrent : null
	}
}