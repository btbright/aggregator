import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import ChatMessage from './ChatMessage.jsx'

class ChatMessageList extends Component {
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
			  {Object.keys(this.props.messages).map(function(key,i){
				return <ChatMessage 
							hasUserClicked={this.props.messages[key].hasUserClicked} 
							onClick={this.props.handleChatMessageClick} 
							key={this.props.messages[key].id} 
							{...this.props.messages[key]} />
			  },this)}
			</div>
			);
	}
}

export default ChatMessageList