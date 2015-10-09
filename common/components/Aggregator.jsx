import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

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
		this.setState({
			isUserPressing : true
		})
		this.props.onPressingStateChange(this.props.id, true);
	}
	endUserPressing(){
		if (this.state.isUserPressing){
			this.props.onPressingStateChange(this.props.id, false);
			this.setState({
				isUserPressing : false
			})
		}
	}
	handleOnMouseUp(){
		this.endUserPressing();
	}
	handleOnMouseOut(){
		this.endUserPressing();
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

		var flash;
		if (this.props.isPressing){
			flash = <div style={{width:'100%',right:100-width + '%'}} className='bar-leader'></div>
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

		var aggregatorClassNames = classnames('aggregator', `aggregator-${this.props.state}`, this.props.isPressing ? 'aggregator-pressing' : '' ,this.props.isComplete ? 'aggregator-level-'+levelColors[getLevel(this.props.residueValue)] : '');
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