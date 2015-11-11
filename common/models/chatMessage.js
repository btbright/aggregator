import shortid from 'shortid'

export function createChatMessage(props){
	return {
		id : props.id || shortid.generate(),
		text : props.text,
		userName : props.userName,
		time : props.time || Date.now(),
		hasAggregator : props.hasAggregator || false,
		aggregationLevel : 0,
		isAggregationComplete : false,
		aggregatorId : props.aggregatorId || ''
	}
}