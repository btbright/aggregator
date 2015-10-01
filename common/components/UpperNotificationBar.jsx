import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class UpperNotificationBar extends Component {
	constructor(props){
		super(props)
	}
	render(){
		return (
			<div className="upper-notification-bar">
				
			</div>
			);
	}
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications
  };
}

export default connect(mapStateToProps)(UpperNotificationBar);