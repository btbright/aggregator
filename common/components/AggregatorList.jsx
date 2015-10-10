import React, { Component, PropTypes } from 'react'
import Aggregator from './Aggregator.jsx'
import { connect } from 'react-redux';
import { packagedAggregatorSelector } from '../selectors/AggregatorSelectors.js';
import * as AggregatorActions from '../actions/aggregators'
import { bindActionCreators } from 'redux'

class AggregatorList extends Component {
	constructor(props){
		super(props)
		this.state = {}
		this.actions = bindActionCreators(AggregatorActions, this.props.dispatch);
		this.onPressingStateChange = this.onPressingStateChange.bind(this);
	}
	onPressingStateChange(id, isUserPressing){
		this.actions.updateIsPressing(id, isUserPressing);
	}
	render(){
		return (
			<div className="aggregator-list">
				{this.props.packagedAggregators.map(aggregatorData => {
					return <Aggregator onPressingStateChange={this.onPressingStateChange} key={aggregatorData.id} aggregator={aggregatorData} />
				})}
			</div>
			)
	}
}

export default connect(packagedAggregatorSelector)(AggregatorList)