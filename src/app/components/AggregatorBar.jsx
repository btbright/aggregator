import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import AggregatorBarText from './AggregatorBarText.jsx'
import cx from 'classnames'
import constants from '../constants/App.js'

class AggregatorBar extends Component {
	constructor(props){
		super(props)
		this.state = {
			flashes : []
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
			rightText = <AggregatorBarText key="rightText" text={this.props.rightText} position='right' />;
		}
		var leftText;
		if (this.props.leftText){
			leftText = <AggregatorBarText key="leftText" text={this.props.leftText} position='left' />
		}

		//add optional residue marker
		var residue;
		if (this.props.residueValue && this.props.residueColorClass){
			var classes = cx('bar-residue', this.props.residueColorClass);
			residue = <div className={classes} style={{width:this.props.residueValue + '%'}}></div>
		}

		//determine wrap class names
		var colorClass = false;
		if (this.props.barColorClass){
			colorClass = this.props.barColorClass
		}
		var barWrapClasses = cx('bar-wrap', colorClass,
			{
				'bar-almost-full' : this.props.barValue > 85
			});

		return (
			<div className="bar">
				<div className={barWrapClasses}>
					{this.state.flashes.map(function(flashKey){
						return <div key={flashKey} style={{width:width + '%',right:width + '%'}} className='bar-leader'></div>
					})}
					{residue}
					<div className="bar-inner" style={{width:width + '%'}}></div>
					{rightText}
					{leftText}
				</div> 
			</div>
			);
	}
}

AggregatorBar.propTypes = {
	rightText: PropTypes.string,
	leftText: PropTypes.string,
	barValue: PropTypes.number.isRequired,
	residueValue: PropTypes.number,
	residueColorClass: PropTypes.string,
	barColorClass: PropTypes.string
}

export default AggregatorBar