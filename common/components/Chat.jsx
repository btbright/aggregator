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
import { chatMessagesWithAggregationInfoSelector } from '../selectors/ChatSelectors.js';
import { createChatMessage } from '../models/chatMessage'
      
class Chat extends Component { 
	constructor(props){ 
		super(props) 
   
		this.handleChatMessageClick = this.handleChatMessageClick.bind(this) 
		this.handleMessageFormSubmit = this.handleMessageFormSubmit.bind(this)

		this.chatActions = bindActionCreators(ChatActions, this.props.dispatch);
		this.aggregatorActions = bindActionCreators(AggregatorActions, this.props.dispatch);
		this.userActions = bindActionCreators(UserActions, this.props.dispatch);
		this.notificationActions = bindActionCreators(NotificationActions, this.props.dispatch);
	}
	shouldComponentUpdate(nextProps){
		return this.props.chatMessages !== nextProps.chatMessages;
	}
	handleChatMessageClick(hasAggregator, isAggregationComplete, messageId, aggregatorId){
		if (hasAggregator && !isAggregationComplete){
			this.aggregatorActions.selectDeselectAggregator(aggregatorId);
		} else if (!hasAggregator) {
			this.aggregatorActions.nominateAggregator("message",messageId);
		}
	}
	handleMessageFormSubmit(text){
		if (!text) return;
  
		if (this.props.userName){
			//find the most recent message with the same text
			var message = this.props.chatMessages.reverse().find(m => m.get('text').toLowerCase() === text.toLowerCase());
			if (message){
				if (message.get('isAggregationComplete')){
					this.chatActions.addChatMessage(createChatMessage({text, userName: this.props.userName}))
					return;
				}
				var secondsSinceMessage = (Date.now() - message.get('time')) / 1000;
				if (secondsSinceMessage <= constants.Chat.STALESECONDS){
					if (this.props.userName !== message.get('userName')){
						//if a message already exists, but it's not aggregating
						if (!message.get('hasAggregator')){
							this.aggregatorActions.nominateAggregator("message",message.get('id'));
							this.notificationActions.addNotification(`Your message has been combined with ${message.get('userName')}'s: ${message.get('text')}`,"informative");
						} else {
							//if the message exists but it's already aggregating
							this.aggregatorActions.selectDeselectAggregator(message.get('aggregatorId'))
						}
					}
					return;
				}
			} 

			this.chatActions.addChatMessage(createChatMessage({text, userName : this.props.userName}))
		} else {
			this.userActions.updateUserName(text);
		}
	}
	render(){
		const { chatMessages, aggregators } = this.props;
		var chatClassNames = classnames('chat');
		return (
			<div className={chatClassNames}>
			  <ChatMessageList onPressingStateChange={this.onPressingStateChange} userName={this.props.userName} messages={chatMessages} handleChatMessageClick={this.handleChatMessageClick} />
			  <ChatMessageForm placeholder={ this.props.userName ? 'Enter a comment...' : 'Enter a user name here to comment...' } onNewMessage={this.handleMessageFormSubmit} />
			</div>
			);
	}
}

export default connect(chatMessagesWithAggregationInfoSelector)(Chat);