import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import ChatMessage from './ChatMessage.jsx'

class ChatMessageList extends Component {
	constructor(props){
		super(props)
		this.buildChatMessage = this.buildChatMessage.bind(this)
	}
	componentDidUpdate(prevProps){
		//if a message has been added, scroll to bottom of message list
		if (prevProps.messages.length !== this.props.messages.length){
			let chatList = React.findDOMNode(this.refs.chatMessageList);
			chatList.scrollTop = chatList.scrollHeight;
		}
	}
	buildChatMessage(message){
		if (message.isComplete){
			return <ChatMessage key={message.id} {...message} />
		} else{
			return <ChatMessage onClick={this.props.handleChatMessageClick} key={message.id} {...message} />
		}
	}
	render(){
		return (
			<div className="chat-message-list" ref="chatMessageList">
			  {Object.keys(this.props.messages).map(function(key,i){
				return this.buildChatMessage(this.props.messages[key]);
			  },this)}
			</div>
			);
	}
}

export default ChatMessageList