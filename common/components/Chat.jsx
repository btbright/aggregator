import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import ChatMessageList from './ChatMessageList.jsx'
import ChatMessageForm from './ChatMessageForm.jsx'
import * as ChatActions from '../actions/chat'
import * as AggregatorActions from '../actions/aggregators'
import * as UserActions from '../actions/user'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { bindChatListeners } from '../apiutils/chat'

class Chat extends Component {
	constructor(props){
		super(props)
		this.handleChatMessageClick = this.handleChatMessageClick.bind(this)
		this.handleMessageFormSubmit = this.handleMessageFormSubmit.bind(this)
		this.chatActions = bindActionCreators(ChatActions, this.props.dispatch);
		this.aggregatorActions = bindActionCreators(AggregatorActions, this.props.dispatch);
		this.userActions = bindActionCreators(UserActions, this.props.dispatch);
		bindChatListeners(this.props.dispatch);
	}
	handleChatMessageClick(e,rawId){
		var id = rawId.substr(rawId.indexOf("$")+1);
		this.chatActions.voteChatMessage(id);
		this.aggregatorActions.newAggregator("message",id);
	}
	handleMessageFormSubmit(text){
		if (!text) return;
		if (this.props.user.userName){
			this.chatActions.newChatMessage(text, this.props.user.userName)
		} else {
			this.userActions.updateUserName(text);
		}
	}
	render(){
		const { chatMessages } = this.props;
		return (
			<div className="chat">
			  <ChatMessageList messages={chatMessages} handleChatMessageClick={this.handleChatMessageClick} />
			  <ChatMessageForm placeholder={ this.props.user.userName ? 'Enter a comment...' : 'Enter a user name here to comment...' } onNewMessage={this.handleMessageFormSubmit} />
			</div>
			);
	}
}

function mapStateToProps(state) {
  return {
    chatMessages: state.chatMessages,
    user : state.user
  };
}

export default connect(mapStateToProps)(Chat);