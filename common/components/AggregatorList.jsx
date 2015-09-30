import React, { Component, PropTypes } from 'react'
import Aggregator from './Aggregator.jsx'
import { connect } from 'react-redux';
import { aggregatedMessagesDisplaySelector } from '../selectors/AggregatorSelectors.js';
import * as AggregatorActions from '../actions/aggregators'
import { bindActionCreators } from 'redux'
import { bindAggregatorListeners } from '../apiutils/aggregators'

class AggregatorList extends Component {
	constructor(props){
		super(props)
		this.actions = bindActionCreators(AggregatorActions, this.props.dispatch);
		this.handleAggregatorClicked = this.handleAggregatorClicked.bind(this)
		bindAggregatorListeners(this.props.dispatch);
	}
	handleAggregatorClicked(e,rawId){
		var id = rawId.substr(rawId.indexOf("$")+1);
		this.actions.newAggregatorClick(id)
	}
	render(){
		return (
			<div className="aggregator-list">
				{this.props.displayReadyAggregatedMessages.map((aggregatorData)=>{
					return <Aggregator updateToNow={this.actions.updateAggregatorToNow} aggregatorClicked={this.handleAggregatorClicked} key={aggregatorData.id} {...aggregatorData} />
				})}
			</div>
			)
	}
}

export default connect(aggregatedMessagesDisplaySelector)(AggregatorList)