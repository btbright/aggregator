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
			retiredAggregators : [],
		  	performanceTime : 0
		}
		this.actions = bindActionCreators(AggregatorActions, this.props.dispatch);
		this.handleAggregatorClicked = this.handleAggregatorClicked.bind(this)
		this.prepareAggregator = this.prepareAggregator.bind(this)
		this.getActiveAggregatorIds = this.getActiveAggregatorIds.bind(this)
		this.retireAggregator = this.retireAggregator.bind(this)
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
		return <Aggregator retire={this.retireAggregator} aggregatorClicked={this.handleAggregatorClicked} key={aggregatorData.id} {...aggregatorData} />;
	}
	getActiveAggregatorIds(){
		return this.props.packagedAggregators.filter(aggregator => !aggregator.isRetired).map(aggregator => aggregator.id);
	}
	retireAggregator(id){
		this.actions.retireAggregator(id)
	}
	start() {
		var frameId = requestAnimationFrame(() => this.start());
		var startTime = performance.now();
		var lastTime = this.state.performanceTime;
		this.setState({
		  frameId: frameId,
		  performanceTime : startTime
		});

		//run animations on in progresss aggregators
		var activeIds = this.getActiveAggregatorIds();
		if (activeIds.length > 0) this.actions.updateAggregatorsToNow(activeIds, lastTime ? (startTime - lastTime)/1000 : 1/60);
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