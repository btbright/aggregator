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
		this.start(this.props.updateToNow)
		/*
		setTimeout(()=>{
			this.stop()
		},3000)
		*/
	}
	start(update) {
		var fps = 60;
		var frameId = requestAnimationFrame(() => this.start(update));
		if (Date.now() - this.state.lastFrameTime > (1000/fps)){
			this.setState({
			  frameId: frameId,
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
			<div onClick={this.props.aggregatorClicked} onMouseDown={this.handleOnMouseDown} onMouseUp={this.handleOnMouseUp} className={aggregatorClassNames}>
				<AggregatorBar 
					ref="aggregatorBar"
					barColorClass={"bar-"+this.props.barColor} 
					barValue={this.props.barValue} 
					rightText={this.props.rightText} 
					residueValue={this.props.residueValue} 
					residueColorClass={"bar-residue-"+this.props.residueColorClass} />
				<AggregatorText displayText={this.props.displayText} />
			</div>
			);
	}
}

Aggregator.propTypes = {
	aggregatorClicked : PropTypes.func
}

export default Aggregator