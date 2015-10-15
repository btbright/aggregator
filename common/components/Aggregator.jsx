import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { levelColors, getLevel } from '../utils/levels'
import constants from '../../common/constants/App'

class Aggregator extends Component {
	constructor(props){
		super(props)
		this.state = {}
		this.handleOnClick = this.handleOnClick.bind(this)
	}
	shouldComponentUpdate(nextProps,nextState){
		return this.props.aggregator.get('x') !== nextProps.aggregator.get('x') || 
			   this.props.aggregator.get('state') !== nextProps.aggregator.get('state') || 
			   this.props.aggregator.get('isPressing') !== nextProps.aggregator.get('isPressing');
	}
	handleOnClick(){
		this.props.onAggregatorClick(this.props.aggregator.get('id'));
	}
	render(){
		var width = this.props.aggregator.get('x');
		var color = levelColors[getLevel(this.props.aggregator.get('maxValue'))];

		//add optional text
		var rightText;
		if (this.props.aggregator.get('chatMessage')){
			rightText = <span className="right-text">{new Date(this.props.aggregator.get('chatMessage').get('time')).toLocaleTimeString()}</span>;
		}
		var leftText;
		if (this.props.aggregator.get('userName')){
			leftText = <span className="left-text">{this.props.aggregator.get('userName')}</span>;
		}

		//add optional residue marker
		var residue;
		if (color){
			var classes = classnames('bar-residue', "bar-residue-"+color);
			residue = <div className={classes} style={{width:this.props.aggregator.get('maxValue') + '%'}}></div>
		}

		if (this.props.aggregator.get('state') === 'initializing'){
			residue = <div className="bar-residue"></div>	
		}

		var flash;
		if (this.props.aggregator.get('isPressing') && (this.props.aggregator.get('state') === 'initializing' || this.props.aggregator.get('state') === 'aggregating')){
			flash = <div style={{width:'100%',right:100-width + '%'}} className='bar-leader'></div>
		}

		//determine wrap class names
		var colorClass = "bar-"+color;
		var barWrapClasses = classnames('bar-wrap', colorClass,
			{
				'bar-almost-full' : width > 85
			});

		var aggregatorClassNames = classnames('aggregator', 
									`aggregator-${this.props.aggregator.get('state')}`, 
									this.props.aggregator.get('isPressing') ? 'aggregator-pressing' : '' ,
									this.props.aggregator.get('state') === 'completed' ? 'aggregator-level-'+levelColors[getLevel(this.props.aggregator.get('maxValue'))] : '');
		return (
			<div onClick={this.handleOnClick} className={aggregatorClassNames}>
				<div className='pressing-dot'></div>
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