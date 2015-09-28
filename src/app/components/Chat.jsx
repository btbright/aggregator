import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import ChatMessageList from './ChatMessageList.jsx'
import ChatMessageForm from './ChatMessageForm.jsx'

class Chat extends Component {
	render(){
		return (
			<div className="chat">
			  <ChatMessageList messages={this.props.messages} chatMessageClicked={this.props.chatMessageClicked} />
			  <ChatMessageForm />
			</div>
			);
	}
}

export default Chat