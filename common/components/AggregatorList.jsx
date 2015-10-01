import React, { Component, PropTypes } from 'react'
import Aggregator from './Aggregator.jsx'
import { connect } from 'react-redux';
import { packagedAggregatorSelector } from '../selectors/AggregatorSelectors.js';
import * as AggregatorActions from '../actions/aggregators'
import { bindActionCreators } from 'redux'
import { bindAggregatorListeners } from '../apiutils/aggregators'

class AggregatorList extends Component {
	constructor(props){
		super(props)
		this.actions = bindActionCreators(AggregatorActions, this.props.dispatch);
		this.handleAggregatorClicked = this.handleAggregatorClicked.bind(this)
		this.prepareAggregator = this.prepareAggregator.bind(this)
		bindAggregatorListeners(this.props.dispatch);
	}
	handleAggregatorClicked(e,rawId){
		var id = rawId.substr(rawId.indexOf("$")+1);
		this.actions.newAggregatorClick(id)
	}
	prepareAggregator(aggregatorData){
		return <Aggregator updateToNow={this.actions.updateAggregatorToNow} retireAggregator={this.actions.retireAggregator} aggregatorClicked={this.handleAggregatorClicked} key={aggregatorData.id} {...aggregatorData} />;
	}
	render(){
		return (
			<div className="aggregator-list">
				{this.props.packagedAggregators.map(this.prepareAggregator)}
			</div>
			)
	}
}

export default connect(packagedAggregatorSelector)(AggregatorList)