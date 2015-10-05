import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import constants from '../constants/App'
import ChatMessageList from './ChatMessageList.jsx'
import ChatMessageForm from './ChatMessageForm.jsx'
import * as ChatActions from '../actions/chat'
import * as AggregatorActions from '../actions/aggregators'
import * as NotificationActions from '../actions/notifications'
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
		this.notificationActions = bindActionCreators(NotificationActions, this.props.dispatch);
		bindChatListeners(this.props.dispatch);
	}
	handleOnMouseDown(){
		this.setState({
			lastMouseDown : Date.now()
		})
	}
	shouldComponentUpdate(nextProps, nextState){
		return this.props !== nextProps || this.state !== nextState;
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
	handleChatMessageClick(isAggregating, messageId, aggregatorId){
		if (isAggregating){
			this.aggregatorActions.newAggregatorClick(aggregatorId);
		} else {
			this.aggregatorActions.newAggregator("message",messageId);
		}
	}
	handleMessageFormSubmit(text){
		if (!text) return;

		if (this.props.user.userName){
			var message = this.props.chatMessages.find((m) => m.text.toLowerCase() === text.toLowerCase());
			if (message){
				var messageAggregator = this.props.aggregatorData.find(a => a.messageId === message.id);
				if (messageAggregator && messageAggregator.isComplete){
					this.chatActions.newChatMessage(text, this.props.user.userName)
					return;
				}
				var secondsSinceMessage = (Date.now() - message.time) / 1000;
				const messageTimeoutSeconds = 60;
				var isMessageFresh = secondsSinceMessage <= messageTimeoutSeconds;
				if (isMessageFresh){
					//if a message already exists, but it's not aggregating
					if (!messageAggregator){
						this.aggregatorActions.newAggregator("message",message.id);
						this.notificationActions.addNotification(`Your message has been combined with ${message.userName}'s: ${message.text}`,"informative");
					//if the message exists but it's already aggregating
					} else {
						this.aggregatorActions.newAggregatorClick(messageAggregator.aggregatorId);
						this.notificationActions.addNotification(`Your message has been counted as support for ${message.userName}'s: ${message.text}`,"informative");
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
			  <ChatMessageList aggregatorData={this.props.aggregatorData} messages={chatMessages} handleChatMessageClick={this.handleChatMessageClick} />
			  <ChatMessageForm placeholder={ this.props.user.userName ? 'Enter a comment...' : 'Enter a user name here to comment...' } onNewMessage={this.handleMessageFormSubmit} />
			</div>
			);
	}
}

export default connect(chatMessagesWithAggregationInfoSelector)(Chat);