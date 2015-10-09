import React, { Component, PropTypes } from 'react'
import ChatMessage from './ChatMessage.jsx'
import { toJS } from 'immutable'

class ChatMessageList extends Component {
	shouldComponentUpdate(nextProps){
		return this.props !== nextProps;
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
				return <ChatMessage onClick={this.props.handleChatMessageClick} key={message.get('id')} {...message.toJS()} />
			  },this)}
			</div>
			);
	}
}

export default ChatMessageList