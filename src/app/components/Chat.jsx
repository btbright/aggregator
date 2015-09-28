import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import ChatMessageList from './ChatMessageList.jsx'
import ChatMessageForm from './ChatMessageForm.jsx'
import * as ChatActions from '../actions/chat'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Chat extends Component {
	constructor(props){
		super(props)
		this.handleChatMessageClick = this.handleChatMessageClick.bind(this)
		this.actions = bindActionCreators(ChatActions, this.props.dispatch);
	}
	handleChatMessageClick(e,rawId){
		var id = rawId.substr(rawId.indexOf("$")+1);
		this.actions.voteChatMessage(id)
	}
	render(){
		const { chatMessages } = this.props;
		return (
			<div className="chat">
			  <ChatMessageList messages={chatMessages} handleChatMessageClick={this.handleChatMessageClick} />
			  <ChatMessageForm onNewMessage={this.actions.newChatMessage} />
			</div>
			);
	}
}

function mapStateToProps(state) {
  return {
    chatMessages: state.chatMessages
  };
}

export default connect(mapStateToProps)(Chat);