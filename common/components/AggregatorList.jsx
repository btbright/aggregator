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
		this.handleOnAggregatorClick = this.handleOnAggregatorClick.bind(this);
	}
	handleOnAggregatorClick(id){
		this.actions.selectDeselectAggregator(id); 
	}
	render(){
		return (
			<div className="aggregator-list">
				{this.props.packagedAggregators.map(aggregatorData => {
					return <Aggregator onAggregatorClick={this.handleOnAggregatorClick} key={aggregatorData.get('id')} aggregator={aggregatorData} />
				}).toArray()}
			</div>
			)
	}
}

export default connect(packagedAggregatorSelector)(AggregatorList)