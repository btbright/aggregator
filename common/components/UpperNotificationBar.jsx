import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import * as NotificationActions from '../actions/notifications'

class UpperNotificationBar extends Component {
	constructor(props){
		super(props)
		this.state = {
			notificationTimeoutHandle : false,
			fadeoutTimeoutHandle : false,
			shouldFadeOut : false
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
		if (this.state.fadeoutTimeoutHandle){
			clearTimeout(this.state.fadeoutTimeoutHandle);
			this.setState({
				fadeoutTimeoutHandle : false
			});
		}
		if (nextProps.notification){
			//remove message
			var timeAlreadyShown = Date.now() - nextProps.notification.timeMadeCurrent;
			var timeoutLength = nextProps.notification.timeToShow - timeAlreadyShown;
			var newHandle = setTimeout(()=>{
				this.setState({
					notificationTimeoutHandle : false,
					shouldFadeOut : false
				});
				this.actions.currentNotificationComplete(Date.now());
			}, timeoutLength);
			this.setState({
				notificationTimeoutHandle : newHandle
			});

			const fadeOutLength = 300;
			if (timeoutLength > fadeOutLength){
				var fadeHandle = setTimeout(()=>{
					this.setState({
						fadeoutTimeoutHandle : false,
						shouldFadeOut : true
					});
				}, timeoutLength - fadeOutLength);
				this.setState({
					fadeoutTimeoutHandle : fadeHandle
				});
			}
		}
	}
	render(){
		var notification;
		if (this.props.notification){
			var classes = classnames('notification', {'notification-fade' : this.state.shouldFadeOut});
			notification = <span className={classes}>{this.props.notification.text}</span>;
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