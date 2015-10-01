import shortid from 'shortid'

export function createChatMessage(props){
	return {
		id : props.id || shortid.generate(),
		text : props.text,
		userName : props.userName,
		time : props.time || Date.now()
	}
}