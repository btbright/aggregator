import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { mapNumbers } from '../utils/mathUtils'

class Permagator extends Component {
	constructor(props){
		super(props)
		this.state = {}
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

		const classes = classnames('permagator', 'clearfix', `permagator-${this.props.id}` {
			'permagator-is-pressing' : this.props.isPressing
		});
		return (
			   <div className={classes}>
		          <div className="progress-holder">
		            <div className="nomination-ring">
		                <div className="wedge-holder wedge-holder-left" style={{transform:`rotateZ(${nominationLeftRotation}deg)`}}>
		                	<div className="wedge"></div>
		              	</div>
		              <div className="wedge-holder wedge-holder-right" style={{transform:`rotateZ(${nominationRightRotation}deg)`}}>
		                <div className="wedge"></div>
		              </div>
		            </div>
		            <div className="residue-ring">
		                <div className="wedge-holder wedge-holder-left" style={{transform:`rotateZ(${residueLeftRotation}deg)`}}>
		                <div className="wedge"></div>
		              </div>
		              <div className="wedge-holder wedge-holder-right" style={{transform:`rotateZ(${residueRightRotation}deg)`}}>
		                <div className="wedge"></div>
		              </div>
		            </div>
		            <div className="progress-ring">
		                <div className="wedge-holder wedge-holder-left" style={{transform:`rotateZ(${progressLeftRotation}deg)`}}>
		                <div className="wedge"></div>
		              </div>
		              <div className="wedge-holder wedge-holder-right" style={{transform:`rotateZ(${progressRightRotation}deg)`}}>
		                <div className="wedge"></div>
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