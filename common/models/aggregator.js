import shortid from 'shortid'

export function createAggregator(props){
	return {
		id: shortid.generate(),
		createdTime: props.createdTime || Date.now(),
		userName : props.user,
		objectType : props.objectType,
		objectId : props.objectId,
		clicks : [props.createdTime || Date.now()],
		maxValue : 0,
		x : 0,
		isComplete : false,
		isRetired : false,
		completedTime : 0,
		lastServerUpdate : false
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