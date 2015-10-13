import shortid from 'shortid'

export function createAggregator(props){
	return {
		id: props.id || shortid.generate(),
		createdTime: props.createdTime || Date.now(),
		userName : props.userName,
		objectType : props.objectType,
		objectId : props.objectId,
		objectUserName : props.objectUserName || '',
		maxValue : 0,
		x : 0,
		velocity : 0,
		lastStateChangeTime : 0,
		state : 'initializing',
		activePresserCount : 0,
		lastServerUpdate : 0,
		level : 0
	}
}