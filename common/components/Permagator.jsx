import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { mapNumbers } from '../utils/mathUtils' 
import { levelColors } from '../utils/levels'

class Permagator extends Component {
	constructor(props){     
		super(props) 
		this.state = {}   
		this.handleOnClick = this.handleOnClick.bind(this)  
	}     
	handleOnClick(){ 
		this.props.onPermagatorClick(this.props.isNominating, this.props.id, this.props.aggregatorId);
	}    
	render(){
		let nominationLeftRotation,
			nominationRightRotation,
			residueLeftRotation, 
			residueRightRotation,
			progressLeftRotation,
			progressRightRotation; 

		if (this.props.nominationPercent >= 0 && this.props.nominationPercent <= 50){
			nominationRightRotation = mapNumbers(this.props.nominationPercent, 0, 50, -180, 0);
			nominationLeftRotation = -180;
		} else {
			nominationRightRotation = 0
			nominationLeftRotation = mapNumbers(this.props.nominationPercent, 50, 100, -180, 0);;
		}
 
		if (this.props.residuePercent >= 0 && this.props.residuePercent <= 50){
			residueRightRotation = mapNumbers(this.props.residuePercent, 0, 50, -180, 0);
			residueLeftRotation = -180;
		} else {
			residueRightRotation = 0
			residueLeftRotation = mapNumbers(this.props.residuePercent, 50, 100, -180, 0);;
		}

		if (this.props.progressPercent >= 0 && this.props.progressPercent <= 50){
			progressRightRotation = mapNumbers(this.props.progressPercent, 0, 50, -180, 0);
			progressLeftRotation = -180;
		} else {
			progressRightRotation = 0
			progressLeftRotation = mapNumbers(this.props.progressPercent, 50, 100, -180, 0);;
		}

		const classes = classnames('permagator', 'clearfix', `permagator-${this.props.id}`, this.props.state ? `permagator-state-${this.props.state}` : false ,this.props.level ? `permagator-level-${levelColors[this.props.level]}` : '', {
			'permagator-pressing' : this.props.isPressing
		});
		return (
			   <div onClick={this.handleOnClick} className={classes}>
			   	  <div className='pressing-dot'></div>
		          <div className="progress-holder">
		            <div className="nomination-ring">
		                <div className="wedge-holder wedge-holder-left">
		                	<div className="wedge" style={{
		                		WebkitTransform:`rotateZ(${nominationLeftRotation}deg)`,
		                		msTransform:`rotateZ(${nominationLeftRotation}deg)`,
		                		transform:`rotateZ(${nominationLeftRotation}deg)`
		                	}}></div>
		              	</div>
		              <div className="wedge-holder wedge-holder-right">
		                <div className="wedge" style={{
		                	WebkitTransform:`rotateZ(${nominationRightRotation}deg)`,
	                		msTransform:`rotateZ(${nominationRightRotation}deg)`,
		                	transform:`rotateZ(${nominationRightRotation}deg)`
		                }}></div>
		              </div>
		            </div>
		            <div className="residue-ring">
		                <div className="wedge-holder wedge-holder-left">
		                <div className="wedge" style={{
		                	WebkitTransform:`rotateZ(${residueLeftRotation}deg)`,
	                		msTransform:`rotateZ(${residueLeftRotation}deg)`,
		                	transform:`rotateZ(${residueLeftRotation}deg)`
		                }}></div>
		              </div>
		              <div className="wedge-holder wedge-holder-right">
		                <div className="wedge" style={{
		                	WebkitTransform:`rotateZ(${residueRightRotation}deg)`,
	                		msTransform:`rotateZ(${residueRightRotation}deg)`,
		                	transform:`rotateZ(${residueRightRotation}deg)`
		                }}></div>
		              </div>
		            </div>
		            <div className="progress-ring">
		                <div className="wedge-holder wedge-holder-left">
		                <div className="wedge" style={{
		                	WebkitTransform:`rotateZ(${progressLeftRotation}deg)`,
	                		msTransform:`rotateZ(${progressLeftRotation}deg)`,
		                	transform:`rotateZ(${progressLeftRotation}deg)`
		                }}></div>
		              </div>
		              <div className="wedge-holder wedge-holder-right">
		                <div className="wedge" style={{
		                	WebkitTransform:`rotateZ(${progressRightRotation}deg)`,
	                		msTransform:`rotateZ(${progressRightRotation}deg)`,
		                	transform:`rotateZ(${progressRightRotation}deg)`
		                }}></div>
		              </div>
		            </div>
		          </div>
		           <div className="text">
		               <p>{this.props.text}</p>
		           </div>
		       </div>
			)
	}
}

Permagator.propTypes = {
	id : PropTypes.string.isRequired,
	nominationPercent : PropTypes.number.isRequired,
	residuePercent : PropTypes.number.isRequired,
	progressPercent : PropTypes.number.isRequired,
	text : PropTypes.string.isRequired,
	isPressing : PropTypes.bool
}
export default Permagator;