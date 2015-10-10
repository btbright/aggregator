import React, { Component, PropTypes } from 'react'
import ChatMessage from './ChatMessage.jsx'
import { toJS } from 'immutable'
import { levelColors, getLevel } from '../utils/levels'

class ChatMessageList extends Component {
	shouldComponentUpdate(nextProps){
		return this.props !== nextProps;
	}
	componentDidUpdate(prevProps){
		//if a message has been added, scroll to bottom of message list
		if (prevProps.messages.size !== this.props.messages.size && !this.props.isClicking){
			let chatList = React.findDOMNode(this.refs.chatMessageList);
			chatList.scrollTop = chatList.scrollHeight;
		}
	}
	render(){
		return (
			<div className="chat-message-list" ref="chatMessageList">
			  {this.props.messages.map(function(message){
			  	var aggregator = this.props.aggregators.find(a => a.get('objectId') === message.get('id'));
			  	var rawAggregator = aggregator ? aggregator.toJS() : {};
			  	console.log(rawAggregator.maxValue)
				return <ChatMessage 
							onClick={this.props.handleChatMessageClick} 
							key={message.get('id')} 
							aggregatorId={rawAggregator.id} 
							aggregationLevel={levelColors[getLevel(rawAggregator.maxValue)]}
							state={rawAggregator.state}
							isComplete={!!aggregator && (rawAggregator.state !== 'initializing' && rawAggregator.state !== 'aggregating')}
							{...message.toJS()} />
			  },this)}
			</div>
			);
	}
}

export default ChatMessageList