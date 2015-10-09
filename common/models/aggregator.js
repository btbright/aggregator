import shortid from 'shortid'

export function createAggregator(props){
	return {
		id: props.id || shortid.generate(),
		createdTime: props.createdTime || Date.now(),
		userName : props.user,
		objectType : props.objectType,
		objectId : props.objectId,
		maxValue : 0,
		x : 0,
		completedTime : 0,
		state : 'initializing'
	}
}

export function createAggregatorServerUpdate({id,x,maxValue,isComplete,completedTime,lastServerUpdate}){
	return {
		id,
		x,
		maxValue,
		isComplete,
		completedTime,
		lastServerUpdate
	}
}