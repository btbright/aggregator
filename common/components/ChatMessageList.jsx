import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import ChatMessage from './ChatMessage.jsx'

class ChatMessageList extends Component {
	componentDidUpdate(){
		let chatList = React.findDOMNode(this.refs.chatMessageList);
		chatList.scrollTop = chatList.scrollHeight;
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