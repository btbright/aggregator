import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as NotificationActions from '../actions/notifications'

class UpperNotificationBar extends Component {
	constructor(props){
		super(props)
		this.state = {
			notificationTimeoutHandle : false
		}
		this.actions = bindActionCreators(NotificationActions, this.props.dispatch);
	}
	componentWillReceiveProps(nextProps){
		if (this.state.notificationTimeoutHandle){
			clearTimeout(this.state.notificationTimeoutHandle);
			this.setState({
				notificationTimeoutHandle : false
			});
		}
		if (nextProps.notification){
			var timeAlreadyShown = Date.now() - nextProps.notification.timeMadeCurrent;
			var timeoutLength = nextProps.notification.timeToShow - timeAlreadyShown;
			var newHandle = setTimeout(()=>{
				this.setState({
					notificationTimeoutHandle : false
				});
				this.actions.currentNotificationComplete(Date.now());
			}, timeoutLength);
			this.setState({
				notificationTimeoutHandle : newHandle
			});
		}
	}
	render(){
		var notification;
		if (this.props.notification){
			notification = <span>{this.props.notification.text}</span>;
		}
		return (
			<div className="upper-notification-bar">
				{notification}				
			</div>
			);
	}
}

function mapStateToProps(state) {
  return {
    notification: state.notifications.current
  };
}

export default connect(mapStateToProps)(UpperNotificationBar);