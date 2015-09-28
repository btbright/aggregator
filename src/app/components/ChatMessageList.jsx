import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import ChatMessage from './ChatMessage.jsx'

class ChatMessageList extends Component {
	render(){
		return (
			<div className="chat-messsage-list">
			  {Object.keys(this.props.messages).map(function(key,i){
				return <ChatMessage hasUserClicked={this.props.messages[key].hasUserClicked} onClick={this.props.chatMessageClicked} key={this.props.messages[key].id} {...this.props.messages[key]} />
			  },this)}
			</div>
			);
	}
}

export default ChatMessageList