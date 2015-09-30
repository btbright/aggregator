import React, { Component, PropTypes } from 'react'
import Aggregator from './Aggregator.jsx'
import { connect } from 'react-redux';
import { aggregatedMessagesDisplaySelector } from '../selectors/AggregatorSelectors.js';
import * as AggregatorActions from '../actions/aggregators'
import { bindActionCreators } from 'redux'

class AggregatorList extends Component {
	constructor(props){
		super(props)
		this.actions = bindActionCreators(AggregatorActions, this.props.dispatch);
		this.handleAggregatorClicked = this.handleAggregatorClicked.bind(this)
	}
	handleAggregatorClicked(e,rawId){
		var id = parseInt(rawId.substr(rawId.indexOf("$")+1),10);
		this.actions.addClickToAggregator(id)
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