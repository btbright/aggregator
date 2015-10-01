import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import AggregationSummary from './AggregationSummary.jsx'

class ChatMessage extends Component {
	constructor(props) {
      	super(props);
		this.state = {}
		this.handleClick = this.handleClick.bind(this)
	}
	handleClick(e, rawId){
		if (!this.props.isComplete){
			var id = rawId.substr(rawId.indexOf("$")+1);
			this.props.onClick(id,this.props);
		}
	}
	render(){
		var commentClasses = cx('comment','clearfix',this.props.aggregationLevel ? 'comment-aggregation-level-'+this.props.aggregationLevel : '',{
			'comment-aggregation-complete' : this.props.isComplete,
			'comment-aggregating' : !!this.props.aggregationLevel && !this.props.isComplete
		});
		return (
			<div onClick={this.handleClick} className={commentClasses}>
			  <span className="comment-time">{new Date(this.props.time).toLocaleTimeString()}</span>
			  <p className="comment-text">
			  	<span className="comment-meta">
			    	<span className="author">{this.props.userName}:</span>
			  	</span>
			  	{this.props.text}
			  </p>
			</div>
			);
	}
}

ChatMessage.propTypes = {
	userName : PropTypes.string.isRequired,
	text : PropTypes.string.isRequired,
	time : PropTypes.number.isRequired,
	aggregationLevel : PropTypes.string
}

ChatMessage.defaultProps = {
	isAggregated : false,
	isComplete : false,
	aggregationLevel : ''
}

export default ChatMessage