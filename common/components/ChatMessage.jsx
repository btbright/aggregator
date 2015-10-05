import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import AggregationSummary from './AggregationSummary.jsx'

var ChatMessage = React.createClass({
	handleClick : function(e, rawId){
		if (!this.props.isComplete){
			var id = rawId.substr(rawId.indexOf("$")+1);
			this.props.onClick(id,this.props);
		}
	},
	getInitialState: function() {
	    return {};
	},
	getDefaultProps: function(){
		return {
			isComplete : false,
			aggregationLevel : ''
		}
	},
	shouldUpdateComponent : function(nextProps){
		return this.props.aggregationLevel !== nextProps.aggregationLevel,
			   this.props.isComplete !== nextProps.isComplete;
	},
	render : function(){
		var commentClasses = cx('comment','clearfix',this.props.aggregationLevel ? 'comment-aggregation-level-'+this.props.aggregationLevel : '',{
			'comment-aggregation-complete' : this.props.isComplete,
			'comment-aggregating' : !!this.props.aggregationLevel && !this.props.isComplete
		});
		return (
			<div onClick={this.handleClick} className={commentClasses}>
			  <span className="comment-time">{this.props.formattedTime}</span>
			  <p className="comment-text">
			  	<span className="comment-meta">
			    	<span className="author">{this.props.userName}:</span>
			  	</span>
			  	{this.props.text}
			  </p>
			</div>
			);
	}
});

export default ChatMessage