import React, { Component, PropTypes } from 'react'
import Permagator from './Permagator.jsx'
import { connect } from 'react-redux';
import { packagedAggregatorSelector } from '../selectors/AggregatorSelectors.js';
import * as AggregatorActions from '../actions/aggregators'
import { bindActionCreators } from 'redux'
import constants from '../constants/App'
 
class PermagatorList extends Component { 
	constructor(props){
		super(props) 
		this.actions = bindActionCreators(AggregatorActions, this.props.dispatch);
		this.handleOnPermagatorClick = this.handleOnPermagatorClick.bind(this);
	} 
	handleOnPermagatorClick(isNominating, permagatorId, aggregatorId){
		if (isNominating){
			this.actions.nominateAggregator("permagator", permagatorId, aggregatorId);
		} else {
			this.actions.selectDeselectAggregator(aggregatorId, permagatorId, 'permagator');
		}
	}
	render(){
		return (
			<div className="permagators">
				{this.props.permagators.map(permagator => {
					return <Permagator 
						onPermagatorClick={this.handleOnPermagatorClick} 
						id={permagator.id}
						key={permagator.id} 
						text={permagator.text}
						isNominating={!permagator.aggregator || permagator.aggregator.state === 'nominating'}
						isPressing={permagator.isPressing || false}
						state={permagator.aggregator ? permagator.aggregator.state : undefined}
						aggregatorId={permagator.aggregator ? permagator.aggregator.id : undefined}
						level={permagator.aggregator ? permagator.aggregator.level : undefined}
						nominationPercent={permagator.aggregator ? (permagator.aggregator.nominationsCount / constants.Aggregator.types.permagator.NOMINATIONTHRESHOLD) * 100 : 0} 
						residuePercent={permagator.aggregator ? permagator.aggregator.maxValue : 0} 
						progressPercent={permagator.aggregator ? permagator.aggregator.x : 0}  />
				})}
			</div>
			)
	}
}

export default connect(packagedAggregatorSelector)(PermagatorList)