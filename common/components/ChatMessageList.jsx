import React, { Component, PropTypes } from 'react'
import ChatMessage from './ChatMessage.jsx'
import { toJS } from 'immutable'

class ChatMessageList extends Component {
	shouldComponentUpdate(nextProps){
		return this.props.messages !== nextProps.messages;
	}
	componentDidUpdate(prevProps){
		//if a message has been added, scroll to bottom of message list
		if (prevProps.messages.size !== this.props.messages.size && !this.props.isClicking){
			let chatList = React.findDOMNode(this.refs.chatMessageList);
			chatList.scrollTop = chatList.scrollHeight;
		}
	}
	render(){
		return (
			<div className="chat-message-list" ref="chatMessageList">
			  {this.props.messages.map(function(message){
				return <ChatMessage 
							userName={this.props.userName}
							onPressingStateChange={this.props.onPressingStateChange}
							onClick={this.props.handleChatMessageClick} 
							key={message.get('id')} 
							message={message}
							 />
			  },this)}
			</div>
			);
	}
}

export default ChatMessageList