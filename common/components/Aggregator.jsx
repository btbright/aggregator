import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import AggregatorBar from './AggregatorBar.jsx'
import AggregatorText from './AggregatorText.jsx'
import constants from '../constants/App.js'
import { levelColors, getLevel } from '../utils/levels'

class Aggregator extends Component {
	constructor(props){
		super(props)
		this.state = {
			lastMouseDown : false,
			isClicking : false
		}
		this.handleOnMouseDown = this.handleOnMouseDown.bind(this)
		this.handleOnMouseUp = this.handleOnMouseUp.bind(this)
	}
	handleOnMouseDown(){
		this.setState({
			lastMouseDown : Date.now()
		})
	}
	handleOnMouseUp(){
		if (!this.state.lastMouseDown || this.props.isComplete) return;
		var timeSinceLastMouseDown = Date.now() - this.state.lastMouseDown;
		if (timeSinceLastMouseDown > constants.Aggregator.CLICKTIMEOUT){
			return;
		}
		this.setState({
			isClicking : true
		});
		this.refs.aggregatorBar.flash();
		setTimeout(() => {
			if (Date.now() - this.state.lastMouseDown < constants.Aggregator.CLICKTIMEOUT) return;
			this.setState({
				isClicking : false
			});
		},constants.Aggregator.CLICKTIMEOUT);
	}
	render(){
		var aggregatorClassNames = classnames('aggregator', this.props.isComplete ? 'aggregator-level-'+levelColors[getLevel(this.props.residueValue)] : '' ,{
			'aggregator-user-clicking' : this.state.isClicking,
			'aggregator-complete' : this.props.isComplete,
			'aggregator-retired' : this.props.isRetired
		});
		return (
			<div onClick={this.props.aggregatorClicked} onMouseDown={this.handleOnMouseDown} onMouseUp={this.handleOnMouseUp} className={aggregatorClassNames}>
				<AggregatorBar 
					ref="aggregatorBar"
					barColorClass={"bar-"+this.props.barColor} 
					barValue={this.props.barValue} 
					rightText={this.props.rightText}
					leftText={this.props.leftText}
					residueValue={this.props.residueValue} 
					residueColorClass={"bar-residue-"+this.props.residueColorClass} />
				<AggregatorText displayText={this.props.displayText} />
			</div>
			);
	}
}

Aggregator.propTypes = {
	aggregatorClicked : PropTypes.func,
	isComplete : PropTypes.bool.isRequired
}

export default Aggregator