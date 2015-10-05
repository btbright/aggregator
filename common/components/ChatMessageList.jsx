import React, { Component, PropTypes } from 'react'
import ChatMessage from './ChatMessage.jsx'

class ChatMessageList extends Component {
	shouldComponentUpdate(nextProps){
		return this.props !== nextProps;
	}
	componentDidUpdate(prevProps){
		//if a message has been added, scroll to bottom of message list
		if (prevProps.messages.length !== this.props.messages.length){
			let chatList = React.findDOMNode(this.refs.chatMessageList);
			chatList.scrollTop = chatList.scrollHeight;
		}
	}
	render(){
		return (
			<div className="chat-message-list" ref="chatMessageList">
			  {this.props.messages.map(function(message){
			  	var aggregatorData = this.props.aggregatorData.find(a => a.messageId === message.id);
				return <ChatMessage onClick={this.props.handleChatMessageClick} key={message.id} {...message} {...aggregatorData} />
			  },this)}
			</div>
			);
	}
}

export default ChatMessageList