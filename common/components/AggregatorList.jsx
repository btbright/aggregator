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
		this.state = {
			frameId : null,
			retiredAggregators : []
		}
		this.actions = bindActionCreators(AggregatorActions, this.props.dispatch);
		this.handleAggregatorClicked = this.handleAggregatorClicked.bind(this)
		this.prepareAggregator = this.prepareAggregator.bind(this)
		bindAggregatorListeners(this.props.dispatch);
		this.start = this.start.bind(this)
		this.stop = this.stop.bind(this)
	}
	componentDidMount() {
		this.start()
	}
	componentWillUnmount(){
		this.stop()
	}
	handleAggregatorClicked(e,rawId){
		var id = rawId.substr(rawId.indexOf("$")+1);
		this.actions.newAggregatorClick(id)
	}
	prepareAggregator(aggregatorData){
		return <Aggregator aggregatorClicked={this.handleAggregatorClicked} key={aggregatorData.id} {...aggregatorData} />;
	}
	maybeUpdateAggregator(aggregator){
		if (aggregator.isComplete){
			if (!this.state.retiredAggregators.find(id => id === aggregator.id)){
				setTimeout(this.retireAggregator.bind(this, aggregator.id),3500);		
				this.setState({
					retiredAggregators : [...this.state.retiredAggregators, aggregator.id]
				});
			}
			return;
		}
		this.actions.updateAggregatorToNow(aggregator.id);
	}
	retireAggregator(id){
		this.actions.retireAggregator(id)
	}
	start() {
		var frameId = requestAnimationFrame(() => this.start());
		this.setState({
		  frameId: frameId
		});

		var startTime = performance.now()
		//run animations on in progresss aggregators
		this.props.packagedAggregators.filter(aggregator => !aggregator.isRetired).forEach(this.maybeUpdateAggregator.bind(this));
		var timeTook = Math.floor((performance.now() - startTime));
		if (timeTook > 16){
			console.warn("took: "+timeTook+" milliseconds")
		}
	}
	stop() {
		cancelAnimationFrame(this.state.frameId);
		this.setState({ frameId: null });
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