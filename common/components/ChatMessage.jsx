import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import AggregationSummary from './AggregationSummary.jsx'

class ChatMessage extends Component {
	constructor(props) {
      	super(props);
		this.state = {
		  shouldShowAggregationSummary : false
		}
		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
	}
	handleMouseEnter(){
		this.setState({
			shouldShowAggregationSummary : true
		})
	}
	handleMouseLeave(){
		this.setState({
			shouldShowAggregationSummary : false
		})
	}
	render(){
		var aggregationSummary;
		if (this.props.isAggregated){
			aggregationSummary = <AggregationSummary shouldShow={this.state.shouldShowAggregationSummary} clicks={this.props.clicks} />
		}
		var commentClasses = cx('comment','clearfix',{
			'comment-aggregated' : this.props.isAggregated,
			'has-clicked' : this.props.hasUserVoted
		});
		return (
			<div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.props.onClick} className={commentClasses}>
			  {aggregationSummary}
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
	hasUserVoted : PropTypes.bool,
	isAggregated : PropTypes.bool,
	clicks : PropTypes.number,
	aggregationLevel : PropTypes.string
}

ChatMessage.defaultProps = {
	hasUserClicked : false,
	isAggregated : false
}

export default ChatMessage