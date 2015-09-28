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
			'has-clicked' : this.props.hasUserClicked
		});
		return (
			<div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.props.onClick} className={commentClasses}>
			  {aggregationSummary}
			  <span className="comment-time">{this.props.formattedTime}</span>
			  <p className="comment-text">
			  	<span className="comment-meta">
			    	<span className="author">{this.props.userName}:</span>
			  	</span>
			  	{this.props.displayText}
			  </p>
			</div>
			);
	}
}

ChatMessage.propTypes = {
	userName : PropTypes.string.isRequired,
	displayText : PropTypes.string.isRequired,
	formattedTime : PropTypes.string.isRequired,
	hasUserClicked : PropTypes.bool,
	isAggregated : PropTypes.bool,
	clicks : PropTypes.number,
	aggregationLevel : PropTypes.string
}

ChatMessage.defaultProps = {
	hasUserClicked : false,
	isAggregated : false
}

export default ChatMessage