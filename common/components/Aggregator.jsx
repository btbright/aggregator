import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import AggregatorBar from './AggregatorBar.jsx'
import AggregatorText from './AggregatorText.jsx'
import constants from '../constants/App.js'
import { levelColors, getLevel } from '../utils/levels'
import _ from 'lodash'

class Aggregator extends Component {
	constructor(props){
		super(props)
		this.state = {
			lastMouseDown : false,
			isClicking : false,
			hasScheduledRetirement : false,
			flashes : []
		}
		this.handleOnMouseDown = this.handleOnMouseDown.bind(this)
		this.handleOnMouseUp = this.handleOnMouseUp.bind(this)
	}
	shouldComponentUpdate(nextProps,nextState){
		return this.props.barValue !== nextProps.barValue || 
			   this.props.rightText !== nextProps.rightText ||
			   this.props.leftText !== nextProps.leftText ||
			   this.props.barColorClass !== nextProps.barColorClass ||
			   this.state.flashes.length !== nextState.flashes.length ||
			   this.props.isRetired !== nextProps.isRetired;
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
		this.flash();
		setTimeout(() => {
			if (Date.now() - this.state.lastMouseDown < constants.Aggregator.CLICKTIMEOUT) return;
			this.setState({
				isClicking : false
			});
		},constants.Aggregator.CLICKTIMEOUT);
	}
	componentWillReceiveProps(nextProps){
		//all this logic keeps state implicitly in css and this element should be
		//moved to the reducer and the transitions should key of start and end frames
		//this componenet should handle setting the opacity directly on the aggregator as well,
		//mapping from 100-0 between the start and end frames
		if (nextProps.isComplete && !this.state.hasScheduledRetirement){
			setTimeout(()=>{
				this.props.retire(this.props.id)
				setTimeout(()=>{
					this.props.remove(this.props.id)
				},400)
			},3500)
			this.setState({
				hasScheduledRetirement : true
			})
		}
	}
	flash(){
		this.setState(function(previousState){
			previousState.flashes.push("flash:"+Date.now());
			return {
				flashes : previousState.flashes
			}
		});
		setTimeout(() => {
			this.setState({
				flashes : _.rest(this.state.flashes) //get array except oldest
			})
		},constants.Aggregator.FLASHLENGTH);
	}
	render(){
		var width = this.props.barValue;

		//add optional text
		var rightText;
		if (this.props.rightText){
			rightText = <span className="right-text">{this.props.rightText}</span>;
		}
		var leftText;
		if (this.props.leftText){
			leftText = <span className="left-text">{this.props.leftText}</span>;
		}

		//add optional residue marker
		var residue;
		if (this.props.residueValue && this.props.residueColorClass){
			var classes = classnames('bar-residue', "bar-residue-"+this.props.residueColorClass);
			residue = <div className={classes} style={{width:this.props.residueValue + '%'}}></div>
		}

		//determine wrap class names
		var colorClass = false;
		if (this.props.barColor){
			colorClass = "bar-"+this.props.barColor
		}
		var barWrapClasses = classnames('bar-wrap', colorClass,
			{
				'bar-almost-full' : this.props.barValue > 85
			});


		var aggregatorClassNames = classnames('aggregator', this.props.isComplete ? 'aggregator-level-'+levelColors[getLevel(this.props.residueValue)] : '' ,{
			'aggregator-user-clicking' : this.state.isClicking,
			'aggregator-complete' : this.props.isComplete,
			'aggregator-retired' : this.props.isRetired
		});
		return (
			<div onClick={this.props.aggregatorClicked} onMouseDown={this.handleOnMouseDown} onMouseUp={this.handleOnMouseUp} className={aggregatorClassNames}>
				<div className="bar">
					<div className={barWrapClasses}>
						{this.state.flashes.map(function(flashKey){
							return <div key={flashKey} style={{width:'100%',right:100-width + '%'}} className='bar-leader'></div>
						})}
						{residue}
						<div className="bar-inner" style={{width:width + '%'}}></div>
						{rightText}
						{leftText}
					</div> 
				</div>
				<div className="text-display">
					<p>{this.props.displayText}</p>
				</div>
			</div>
			);
	}
}

Aggregator.propTypes = {
	aggregatorClicked : PropTypes.func,
	isComplete : PropTypes.bool.isRequired,
	rightText: PropTypes.string,
	leftText: PropTypes.string,
	barValue: PropTypes.number.isRequired,
	residueValue: PropTypes.number,
	residueColorClass: PropTypes.string,
	barColorClass: PropTypes.string
}

export default Aggregator