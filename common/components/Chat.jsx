import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import constants from '../constants/App'
import ChatMessageList from './ChatMessageList.jsx'
import ChatMessageForm from './ChatMessageForm.jsx'
import * as ChatActions from '../actions/chat'
import * as AggregatorActions from '../actions/aggregators'
import * as UserActions from '../actions/user'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { bindChatListeners } from '../apiutils/chat'
import { chatMessagesWithAggregationInfoSelector } from '../selectors/ChatSelectors.js';

class Chat extends Component {
	constructor(props){
		super(props)
		this.state = {
			lastMouseDown : false,
			isClicking : false
		}
		this.handleOnMouseDown = this.handleOnMouseDown.bind(this)
		this.handleOnMouseUp = this.handleOnMouseUp.bind(this)
		this.handleChatMessageClick = this.handleChatMessageClick.bind(this)
		this.handleMessageFormSubmit = this.handleMessageFormSubmit.bind(this)
		this.chatActions = bindActionCreators(ChatActions, this.props.dispatch);
		this.aggregatorActions = bindActionCreators(AggregatorActions, this.props.dispatch);
		this.userActions = bindActionCreators(UserActions, this.props.dispatch);
		bindChatListeners(this.props.dispatch);
	}
	handleOnMouseDown(){
		this.setState({
			lastMouseDown : Date.now()
		})
	}
	handleOnMouseUp(){
		if (!this.state.lastMouseDown) return;
		var timeSinceLastMouseDown = Date.now() - this.state.lastMouseDown;
		if (timeSinceLastMouseDown > constants.Aggregator.CLICKTIMEOUT){
			return;
		}
		this.setState({
			isClicking : true
		});
		setTimeout(() => {
			if (Date.now() - this.state.lastMouseDown < constants.Aggregator.CLICKTIMEOUT) return;
			this.setState({
				isClicking : false
			});
		},constants.Aggregator.CLICKTIMEOUT);
	}
	handleChatMessageClick(id, messageProps){
		if (messageProps.aggregationLevel){
			this.aggregatorActions.newAggregatorClick(messageProps.aggregatorId);
		} else {
			this.aggregatorActions.newAggregator("message",id);
		}
	}
	handleMessageFormSubmit(text){
		if (!text) return;
		if (this.props.user.userName){
			var message = this.props.chatMessages.filter((m)=>!m.isComplete).find((m) => m.text.toLowerCase() === text.toLowerCase());
			if (message){
				var secondsSinceMessage = (Date.now() - message.time) / 1000;
				const messageTimeoutSeconds = 60;
				var isMessageFresh = secondsSinceMessage <= messageTimeoutSeconds;
				if (isMessageFresh){
					//if a message already exists, but it's not aggregating
					if (!message.aggregationLevel){
						this.aggregatorActions.newAggregator("message",message.id);
						//TODO - notify user that his message has been aggregated
						console.log("your message has been combined with "+message.userName+"'s");
					//if the message exists but it's already aggregating
					} else {
						this.aggregatorActions.newAggregatorClick(message.aggregatorId);
						//TODO - notify user that his message has been counted as a click for the active aggregator
						console.log("your message has been counted as support for "+message.userName+"'s");
					}
					return;
				}
			}

			this.chatActions.newChatMessage(text, this.props.user.userName)
		} else {
			this.userActions.updateUserName(text);
		}
	}
	render(){
		const { chatMessages } = this.props;
		var chatClassNames = classnames('chat', {
			'chat-user-clicking' : this.state.isClicking
		});
		return (
			<div className={chatClassNames} onMouseDown={this.handleOnMouseDown} onMouseUp={this.handleOnMouseUp}>
			  <ChatMessageList messages={chatMessages} handleChatMessageClick={this.handleChatMessageClick} />
			  <ChatMessageForm placeholder={ this.props.user.userName ? 'Enter a comment...' : 'Enter a user name here to comment...' } onNewMessage={this.handleMessageFormSubmit} />
			</div>
			);
	}
}

function mapStateToProps(state) {
  var selectedState = chatMessagesWithAggregationInfoSelector(state);
  return {
    chatMessages: selectedState.messagesWithAggregationInfo,
    user : selectedState.user
  };
}

export default connect(mapStateToProps)(Chat);