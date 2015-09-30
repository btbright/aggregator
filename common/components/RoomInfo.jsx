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
		return (
			<div className="room-info">
			  <span className="room-name">#{this.props.name}</span>
			  <span className="user-count">{this.props.userCount} users</span>
			</div>
			);
	}
}

function mapStateToProps(state) {
  return {
    userCount: state.room.userCount,
    name: state.room.name
  };
}

export default connect(mapStateToProps)(RoomInfo);