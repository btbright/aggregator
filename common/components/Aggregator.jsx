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
			isClicking : false,
			frameId : null,
			lastFrameTime : 0,
			frame : 0
		}
		this.handleOnMouseDown = this.handleOnMouseDown.bind(this)
		this.handleOnMouseUp = this.handleOnMouseUp.bind(this)
		this.start = this.start.bind(this)
		this.stop = this.stop.bind(this)
	}
	componentDidMount() {
		if (!this.props.isComplete){
			this.start(this.props.updateToNow)
		}
	}
	componentWillUnmount(){
		this.stop()
	}
	start(update) {
		if (this.props.isComplete){
			this.stop()
			return
		}
		var fps = 60;
		var frameId = requestAnimationFrame(() => this.start(update));
		this.setState({
		  frameId: frameId
		});
		if (Date.now() - this.state.lastFrameTime > (1000/fps)){
			this.setState({
			  frame: this.state.frame + 1,
			  lastFrameTime : Date.now()
			});
			update(this.props.id);
		}
	}
	stop() {
		cancelAnimationFrame(this.state.frameId);
		this.setState({ frameId: null, startedAt: null, frame: 0 });
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
			'aggregator-complete' : this.props.isComplete
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