import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import AggregatorBar from './AggregatorBar.jsx'
import AggregatorText from './AggregatorText.jsx'
import constants from '../constants/App.js'

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
		if (!this.state.lastMouseDown) return;
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
		var aggregatorClassNames = classnames('aggregator',{
			'aggregator-user-clicking' : this.state.isClicking
		});
		return (
			<div onMouseDown={this.handleOnMouseDown} onMouseUp={this.handleOnMouseUp} className={aggregatorClassNames}>
				<AggregatorBar 
					ref="aggregatorBar"
					barColorClass={"bar-"+this.props.barColor} 
					barValue={this.props.barValue} 
					rightText={this.props.rightText} 
					residueValue={this.props.residueValue} 
					residueColorClass={"bar-residue-"+this.props.residueColor} />
				<AggregatorText displayText={this.props.displayText} />
			</div>
			);
	}
}

export default Aggregator