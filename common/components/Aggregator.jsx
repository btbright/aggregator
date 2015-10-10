import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { levelColors, getLevel } from '../utils/levels'

class Aggregator extends Component {
	constructor(props){
		super(props)
		this.state = {
			isUserPressing : false
		}
		this.handleOnMouseDown = this.handleOnMouseDown.bind(this)
		this.handleOnMouseUp = this.handleOnMouseUp.bind(this)
		this.handleOnMouseOut = this.handleOnMouseOut.bind(this)
		this.endUserPressing = this.endUserPressing.bind(this)
	}
	shouldComponentUpdate(nextProps,nextState){
		return this.props !== nextProps;
	}
	handleOnMouseDown(){
		if (this.props.state === 'initializing' || this.props.state === 'aggregating'){
			this.setState({
				isUserPressing : true
			})
			this.props.onPressingStateChange(this.props.id, true);
		}
	}
	endUserPressing(){
		if (this.state.isUserPressing && (this.props.state === 'initializing' || this.props.state === 'aggregating')){
			this.props.onPressingStateChange(this.props.id, false);
		}
		this.setState({
			isUserPressing : false
		})
	}
	handleOnMouseUp(){
		this.endUserPressing();
	}
	handleOnMouseOut(){
		this.endUserPressing();
	}
	render(){
		var width = this.props.aggregator.get('x');
		var color = levelColors[getLevel(this.props.aggregator.get('maxValue'))];

		//add optional text
		var rightText;
		if (this.props.rightText){
			rightText = <span className="right-text">{new Date(this.props.aggregator.get('chatMessage').get('time')).toLocaleTimeString()}</span>;
		}
		var leftText;
		if (this.props.leftText){
			leftText = <span className="left-text">{this.props.aggregator.get('userName')}</span>;
		}

		//add optional residue marker
		var residue;
		if (color){
			var classes = classnames('bar-residue', "bar-residue-"+color);
			residue = <div className={classes} style={{width:this.props.aggregator.get('maxValue') + '%'}}></div>
		}

		var flash;
		if (this.props.aggregator.get('isPressing')){
			flash = <div style={{width:'100%',right:100-width + '%'}} className='bar-leader'></div>
		}

		//determine wrap class names
		var colorClass = "bar-"+color;
		var barWrapClasses = classnames('bar-wrap', colorClass,
			{
				'bar-almost-full' : width > 85
			});

		var aggregatorClassNames = classnames('aggregator', `aggregator-${this.props.state}`, this.props.isPressing ? 'aggregator-pressing' : '' ,this.props.aggregator.get('state') === 'completed' ? 'aggregator-level-'+levelColors[getLevel(this.props.aggregator.get('maxValue'))] : '');
		return (
			<div onMouseDown={this.handleOnMouseDown} onMouseOut={this.handleOnMouseOut} onMouseUp={this.handleOnMouseUp} className={aggregatorClassNames}>
				<div className="bar">
					<div className={barWrapClasses}>
						{flash}
						{residue}
						<div className="bar-inner" style={{width:width + '%'}}></div>
						{rightText}
						{leftText}
					</div> 
				</div>
				<div className="text-display">
					<p>{this.props.aggregator.get('chatMessage').get('text')}</p>
				</div>
			</div>
			);
	}
}

export default Aggregator