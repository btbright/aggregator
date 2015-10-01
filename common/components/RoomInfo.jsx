import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindRoomListeners } from '../apiutils/room'
import { requestUpdateRoom } from '../actions/room'

class RoomInfo extends Component {
	constructor(props){
		super(props)
		bindRoomListeners(this.props.dispatch);
		this.props.dispatch(requestUpdateRoom(this.props.name))
	}
	render(){
		var userName;
		if (this.props.userName){
			userName = <span className="user-name">{this.props.userName}</span>
		}
		var userCount;
		if (this.props.userCount){
			userCount = <span className="user-count">{this.props.userCount} users</span>
		}

		return (
			<div className="room-info">
				<div className="right-info">
					{userCount}
					{userName}
				</div>
				<span className="room-name">#{this.props.name}</span>
			</div>
			);
	}
}

function mapStateToProps(state) {
  return {
    userCount: state.room.userCount,
    name: state.room.name,
    userName : state.user.userName
  };
}

export default connect(mapStateToProps)(RoomInfo);