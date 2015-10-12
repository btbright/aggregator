import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import { levelColors, getLevel } from '../utils/levels'

class ChatMessage extends Component {
	constructor(props) {
      	super(props);
		this.state = {}
		this.handleClick = this.handleClick.bind(this)
	}
	handleClick(e, rawId){
		this.props.onClick(this.props.message.get('hasAggregator'), this.props.message.get('isAggregationComplete'), this.props.message.get('id'), this.props.message.get('aggregatorId'));
	}
	shouldComponentUpdate(nextProps){
		return this.props.message !== nextProps.message;
	}
	render(){
		var commentClasses = cx(
								'comment',
								'clearfix',
								this.props.message.get('hasAggregator') ? 'comment-aggregation-level-'+levelColors[this.props.message.get('aggregationLevel')] : '',
								this.props.message.get('isAggregationComplete') ? 'comment-aggregation-complete' : ''
							);
		return (
			<div onMouseDown={this.handleOnMouseDown} onMouseOut={this.handleOnMouseOut} onMouseUp={this.handleOnMouseUp} onClick={this.handleClick} className={commentClasses}>
			  <span className="comment-time">{ new Date(this.props.message.get('time')).toLocaleTimeString() }</span>
			  <p className="comment-text">
			  	<span className="comment-meta">
			    	<span className="author">{this.props.message.get('userName')}:</span>
			  	</span>
			  	{this.props.message.get('text')}
			  </p>
			</div>
			);
	}
}

ChatMessage.defaultProps = {
	isAggregationComplete : false,
	aggregationLevel : ''
}

export default ChatMessage