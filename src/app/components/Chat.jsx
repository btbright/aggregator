import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import ChatMessageList from './ChatMessageList.jsx'
import ChatMessageForm from './ChatMessageForm.jsx'
import * as ChatActions from '../actions/chat'
import * as AggregatorActions from '../actions/aggregators'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Chat extends Component {
	constructor(props){
		super(props)
		this.handleChatMessageClick = this.handleChatMessageClick.bind(this)
		this.chatActions = bindActionCreators(ChatActions, this.props.dispatch);
		this.aggregatorActions = bindActionCreators(AggregatorActions, this.props.dispatch);
	}
	handleChatMessageClick(e,rawId){
		var id = parseInt(rawId.substr(rawId.indexOf("$")+1),10);
		this.chatActions.voteChatMessage(id)
		this.aggregatorActions.addAggregator("message",id);
	}
	render(){
		const { chatMessages } = this.props;
		return (
			<div className="chat">
			  <ChatMessageList messages={chatMessages} handleChatMessageClick={this.handleChatMessageClick} />
			  <ChatMessageForm onNewMessage={this.chatActions.newChatMessage} />
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